import 'package:software_analista/domain/enums/extensions_scuola.dart';
import 'package:software_analista/domain/enums/extensions_titoloStudio.dart';
import 'package:software_analista/domain/enums/scuola.dart';
import 'package:software_analista/domain/enums/titoloStudio.dart';
import 'package:software_analista/domain/models/diagnosi.dart';
import 'package:software_analista/domain/models/percorsoAssegnato.dart';
import 'package:software_analista/domain/models/progressoPercorso.dart';
import 'package:software_analista/domain/enums/sesso.dart';

class Utente {
  final String? id;
  final String nome;
  final String cognome;
  final DateTime dataDiNascita;
  final Sesso sesso;
  final String? email;
  final String? numTelefono;
  final Scuole scuolaFrequentata;
  final TitoloStudio titoloStudio;
  final ProgressoPercorso? progressoUtente;
  final List<PercorsoAssegnato> percorsiAssegnati;
  final String? codiceGioco;
  final Diagnosi? diagnosi;

  Utente({
    this.id,
    required this.nome,
    required this.cognome,
    required this.dataDiNascita,
    required this.sesso,
    this.email,
    this.numTelefono,
    required this.scuolaFrequentata,
    required this.titoloStudio,
    this.progressoUtente,
    this.percorsiAssegnati = const [],
    this.codiceGioco,
    this.diagnosi,
  });

  // 🔹 JSON → Dart
  factory Utente.fromJson(Map<String, dynamic> json) {
    return Utente(
      id: json['_id'],
      nome: json['nome'],
      cognome: json['cognome'],
      dataDiNascita: DateTime.parse(json['dataNascita']),
      sesso: Sesso.values.firstWhere((e) => e.name == json['sesso']),
      email: json['email'],
      // The API field is numTelefono; 'telefono' was always null
      numTelefono: json['numTelefono'],
      scuolaFrequentata: ScuolaExtension.fromApiValue(
        json['scuolaFrequentata'],
      ),
      titoloStudio: TitoloStudioExtension.fromApiValue(json['titoloStudio']),
      codiceGioco: json['codiceGioco'],
      percorsiAssegnati:
          (json['percorsiAssegnati'] as List<dynamic>?)
              ?.map(
                (e) => PercorsoAssegnato.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          [],
      diagnosi:
          json['diagnosi'] != null ? Diagnosi.fromMap(json['diagnosi']) : null,
    );
  }

  // 🔹 Dart → JSON
  Map<String, dynamic> toJson() {
    return {
      'nome': nome,
      'cognome': cognome,
      'dataNascita': dataDiNascita.toIso8601String(),
      'sesso': sesso.name,
      'email': email,
      // Must match the API field name, otherwise the number is never saved
      'numTelefono': numTelefono,
      'scuolaFrequentata': scuolaFrequentata.name,
      'titoloStudio': titoloStudio.name,
    };
  }
}
