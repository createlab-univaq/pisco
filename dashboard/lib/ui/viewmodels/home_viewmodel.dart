import 'package:flutter/material.dart';
import 'package:software_analista/data/repository/homeRepository.dart';
import 'package:software_analista/data/repository/lista_percorsiRepository.dart';
import 'package:software_analista/data/repository/lista_utentiRepository.dart';
import 'package:software_analista/data/service/homeService.dart';
import 'package:software_analista/data/service/lista_percorsiService.dart';
import 'package:software_analista/data/service/lista_utentiService.dart';
import 'package:software_analista/domain/enums/tipoTest.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/enums/sesso.dart';
import 'package:software_analista/domain/models/linechartpoint.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';
import 'package:software_analista/domain/models/testStat.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class HomeViewModel extends ChangeNotifier {
  final ListaUtentiRepository _utentiRepository = ListaUtentiRepository(
    ListaUtentiService(),
  );
  final HomeRepository _homeRepository = HomeRepository(HomeService());
  final PercorsiRepository _percorsiRepository = PercorsiRepository(
    PercorsiService(),
  );

  bool isLoading = false;
  List<Test> _tests = [];

  /// tutti i test dell'utente
  List<TestStat> _stats = [];
  List<LineChartPoint> _chartData = [];
  List<LineChartPoint> get chartData => _chartData;

  int numeroUtenti = 0;
  int numeroMaschi = 0;
  int numeroFemmine = 0;
  int numeroPercorsi = 0;

  List<Test> get tests => _tests;
  List<TestStat> get stats => _stats;
  List<Test> get testPre =>
      tests.where((t) => t.tipoTest == TipoTest.pre).toList();

  List<Test> get testPost =>
      tests.where((t) => t.tipoTest == TipoTest.post).toList();

  HomeViewModel() {
    caricaDati().catchError((e) {
      if (e is! SessionExpiredException) {
        debugPrint('Errore caricamento home: $e');
      }
    });
  }

  Future<void> caricaDati() async {
    isLoading = true;
    notifyListeners();

    try {
      // Recupero lista completa degli utenti
      final List<Utente> utenti = await _utentiRepository.listaUtenti();
      final percorsi = await _percorsiRepository.getPercorsi();

      // Calcolo dati per la home
      numeroUtenti = utenti.length;
      numeroMaschi = utenti.where((b) => b.sesso == Sesso.maschio).length;
      numeroFemmine = utenti.where((b) => b.sesso == Sesso.femmina).length;
      numeroPercorsi = percorsi.length;

      // Recupero numero percorsi da definire

      _tests = await _homeRepository.getAllTentativi();
      _stats = _calcolaStatistiche(_tests);
      _chartData = _calcolaDatiGrafico(_tests);
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      // gestione errori
      numeroUtenti = 0;
      numeroMaschi = 0;
      numeroFemmine = 0;
      numeroPercorsi = 0;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  List<TestStat> _calcolaStatistiche(List<Test> tests) {
    final Map<String, List<Test>> grouped = {};

    // Raggruppo per nomeTest
    for (var test in tests) {
      grouped.putIfAbsent(test.nomeTest, () => []);
      grouped[test.nomeTest]!.add(test);
    }

    List<TestStat> result = [];

    grouped.forEach((nome, listaTest) {
      final pre = listaTest.where((t) => t.tipoTest == TipoTest.pre).toList();

      final post = listaTest.where((t) => t.tipoTest == TipoTest.post).toList();

      double percentualePre = 0;
      double percentualePost = 0;
      double tempoMedio = 0;

      if (pre.isNotEmpty) {
        percentualePre =
            (pre.where((t) => t.superato!).length / pre.length) * 100;
      }

      if (post.isNotEmpty) {
        percentualePost =
            (post.where((t) => t.superato!).length / post.length) * 100;
      }

      if (listaTest.isNotEmpty) {
        tempoMedio =
            listaTest.map((t) => t.tempoMedioReazione).reduce((a, b) => a + b) /
            listaTest.length;
      }

      result.add(
        TestStat(
          nomeTest: nome,
          percentualePre: percentualePre,
          percentualePost: percentualePost,
          tempoMedio: tempoMedio,
        ),
      );
    });

    return result;
  }

  List<LineChartPoint> _calcolaDatiGrafico(List<Test> tests) {
    final Map<String, List<Test>> grouped = {};

    for (var test in tests) {
      grouped.putIfAbsent(test.nomeTest, () => []);
      grouped[test.nomeTest]!.add(test);
    }

    List<LineChartPoint> result = [];

    grouped.forEach((nome, listaTest) {
      if (listaTest.isNotEmpty) {
        double totaleCorrette = 0;

        for (var test in listaTest) {
          final corrette = test.domande.where((d) => d.correct == true).length;

          totaleCorrette += corrette;
        }

        double percentuale =
            totaleCorrette /
            listaTest.fold(0, (sum, t) => sum + t.domande.length);

        result.add(LineChartPoint(label: nome, value: percentuale * 100));
      }
    });
    result.sort((a, b) => a.label.compareTo(b.label));

    return result;
  }
}
