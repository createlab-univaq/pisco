import 'package:software_analista/domain/enums/scuola.dart';

extension ScuolaExtension on Scuole {
  static Scuole fromLabel(String? label) {
    switch (label) {
      case 'Scuola secondaria di primo grado':
        return Scuole.Scuola_secondaria_di_primo_grado;
      case 'Scuola secondaria di secondo grado':
        return Scuole.Scuola_secondaria_di_secondo_grado;
      case 'Università':
        return Scuole.Universita;
      case 'Non frequento':
        return Scuole.Non_frequento;
      case 'Altro':
        return Scuole.Altro;
      default:
        return Scuole.Non_frequento; // valore di fallback sicuro
    }
  }

  String get label {
    switch (this) {
      case Scuole.Scuola_secondaria_di_primo_grado:
        return 'Scuola secondaria di primo grado';
      case Scuole.Scuola_secondaria_di_secondo_grado:
        return 'Scuola secondaria di secondo grado';
      case Scuole.Universita:
        return 'Università';
      case Scuole.Non_frequento:
        return 'Non frequento';
      case Scuole.Altro:
        return 'Altro';
    }
  }

  static Scuole fromApiValue(String value) {
    return Scuole.values.firstWhere(
      (e) => e.name == value,
      orElse: () {
        throw Exception('Valore scuola non valido: $value');
      },
    );
  }
}

