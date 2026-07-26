import 'package:software_analista/domain/enums/livelloGravita.dart';

class Diagnosi {
  final String testo;
  final LivelloGravita livelloGravita;
  final String? note;
  final DateTime dataInserimento;

  Diagnosi({
    required this.testo,
    required this.livelloGravita,
    this.note,
    required this.dataInserimento,
  });

  factory Diagnosi.fromMap(Map<String, dynamic> map) {
    return Diagnosi(
      testo: map['testo'],
      livelloGravita:
          LivelloGravita.values.byName(map['livelloGravita']),
      note: map['note'],
      dataInserimento: DateTime.parse(map['dataInserimento']),
    );
  }

  Map<String, dynamic> toMap() => {
        'testo': testo,
        'livelloGravita': livelloGravita.name,
        'note': note,
        'dataInserimento': dataInserimento.toIso8601String(),
      };
}
