import 'package:software_analista/domain/enums/titoloStudio.dart';

extension TitoloStudioExtension on TitoloStudio{
  String get label{
    switch (this) {
      case TitoloStudio.Diploma_di_terza_media:
        return 'Diploma di terza media';
      case TitoloStudio.Diploma_di_scuola_superiore:
        return 'Diploma di scuola superiore';
      case TitoloStudio.Laurea_di_I_livello:
        return 'Laurea di I livello';
      case TitoloStudio.Laurea_di_II_livello:
        return 'Laurea di II livello';
      case TitoloStudio.Master_dottorato_specializzazione:
        return 'Master/Dottorato/Specializzazione';
    }
  }

   static TitoloStudio fromLabel(String value) {
    return TitoloStudio.values.firstWhere(
      (e) => e.label == value,
    );
  }

  static TitoloStudio fromApiValue(String value) {
    return TitoloStudio.values.firstWhere(
      (e) => e.name == value,
      orElse: () {
        throw Exception('Valore titolo di studio non valido: $value');
      },
    );
  }
}
