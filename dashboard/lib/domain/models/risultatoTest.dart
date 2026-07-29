import 'package:software_analista/domain/enums/tipoTest.dart';
import 'package:software_analista/domain/models/domandeTest.dart';

class Test {
  final String testId;
  final String utenteId;
  final String? percorsoId; // per ora opzionale
  final String nomeTest;
  final TipoTest tipoTest;
  final bool? superato;
  //final String metodoInterazione;
  final double tempoMedioReazione;
  final int movimentoMouse;
  final List<Domandetest> domande;

  Test({
    required this.testId,
    required this.utenteId,
    this.percorsoId,
    required this.nomeTest,
    required this.tipoTest,
    this.superato,
    //required this.metodoInterazione,
    required this.tempoMedioReazione,
    required this.movimentoMouse,
    required this.domande,
  });

  int get totaleDomande => domande.length;
  int get domandeCorrette => domande.where((d) => d.correct == true).length;

  /*double get tempoMedioReazione {
    if (domande.isEmpty) return 0;
    return domande
            .map((d) => d.tempoReazione)
            .reduce((a, b) => a + b) /
        domande.length;
  }*/

  factory Test.fromJson(Map<String, dynamic> json) {
    final domandeJson = json['domande'] as List<dynamic>? ?? [];

    return Test(
      testId: json['_id'],
      utenteId: json['utenteId'],
      percorsoId: json['percorsoId'],
      nomeTest: json['nomeTest'],
      tipoTest: json['tipoTest'] == 'pre' ? TipoTest.pre : TipoTest.post,
      superato: json['superato'] as bool,
      tempoMedioReazione: (json['tempoMedioReazione'] as num).toDouble(),
      //metodoInterazione: json['metodoInterazione'],
      movimentoMouse: json['movimentoMouse'] as int,
      domande:
          domandeJson
              .map((d) => Domandetest.fromJson(d as Map<String, dynamic>))
              .toList(),
    );
  }
}
