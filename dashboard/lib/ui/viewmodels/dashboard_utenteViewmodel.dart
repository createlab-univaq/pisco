import 'package:flutter/foundation.dart';
import 'package:software_analista/data/repository/dashboard_utenteRepository.dart';
import 'package:software_analista/domain/enums/tipoTest.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/diagnosi.dart';
import 'package:software_analista/domain/models/linechartpoint.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class DashboardUtenteViewModel extends ChangeNotifier {
  Utente _utente;
  bool _isLoading = false;
  final DashboardUtenterepository _repository;
  List<Test> _tests = [];

  /// tutti i test dell'utente

  DashboardUtenteViewModel({
    required Utente utente,
    required DashboardUtenterepository repository,
  }) : _utente = utente,
       _repository = repository;

  // ===============================
  // GETTERS
  // ===============================

  Utente get utente => _utente;
  bool get isLoading => _isLoading;
  List<Test> get tests => _tests;
  List<Test> get testPre =>
      tests.where((t) => t.tipoTest == TipoTest.pre).toList();

  List<Test> get testPost =>
      tests.where((t) => t.tipoTest == TipoTest.post).toList();

  List<LineChartPoint> get progressiPreChartData => _buildChartData(testPre);

  List<LineChartPoint> get progressiPostChartData => _buildChartData(testPost);
  double get maxPreY => _getMaxY(testPre) + 1;
  double get maxPostY => _getMaxY(testPost) + 1;

  // ===============================
  // INIT
  // ===============================

  Future<void> initialize() async {
    _setLoading(true);

    try {
      // Carica tutti i test dell'utente dalla repository
      _tests = await _repository.getTestByUtente(_utente.codiceGioco);
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      print("Errore caricamento test: $e");
      _tests = [];
    }

    _setLoading(false);
  }

  Future<void> reloadTests() async {
    _setLoading(true);
    _tests = await _repository.getTestByUtente(_utente.codiceGioco);
    _setLoading(false);
  }

  List<LineChartPoint> _buildChartData(List<Test> listaTest) {
    if (listaTest.isEmpty) return [];

    return listaTest.map((test) {
      return LineChartPoint(
        label: test.nomeTest,
        value: test.domandeCorrette.toDouble(),
      );
    }).toList();
  }

  double _getMaxY(List<Test> listaTest) {
    if (listaTest.isEmpty) return 10;

    return listaTest
        .map((e) => e.domandeCorrette)
        .reduce((a, b) => a > b ? a : b)
        .toDouble();
  }

  Future<void> inserisciDiagnosi(Diagnosi diagnosi) async {
    _setLoading(true);

    try {
      final utenteAggiornato = await _repository.salvaDiagnosi(
        utente.id,
        diagnosi,
      );
      _utente = utenteAggiornato;

      notifyListeners();
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      debugPrint('Errore durante il salvataggio della diagnosi: $e');
    }

    _setLoading(false);
    notifyListeners();
  }

  Future<void> modificaDiagnosi(Diagnosi diagnosi) async {
    await inserisciDiagnosi(diagnosi);
  }

  Future<void> eliminaDiagnosi() async {
    _setLoading(true);
    notifyListeners();

    try {
      final Utente utenteAggiornato = await _repository.eliminaDiagnosi(
        utente.id,
      );
      _utente = utenteAggiornato;
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      debugPrint('Errore durante eliminazione diagnosi: $e');
    }

    _setLoading(false);
    notifyListeners();
  }

  Future<void> esportaExcel(String utenteId, String nome) async {
    try {
      _setLoading(true);

      await _repository.downloadExcel(_utente.id!, _utente.nome);
    } catch (e) {
      debugPrint("Errore nel dowload del file excel: $e");
    } finally {
      _setLoading(false);
    }
  }

  Future<void> rimuoviPercorso(String percorsoId) async {
    await _repository.rimuoviPercorso(utente.id!, percorsoId);

    utente.percorsiAssegnati.removeWhere(
      (p) => p.percorsoIdEsterno == percorsoId,
    );

    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
