import 'package:software_analista/domain/enums/sesso.dart';

String FormatSesso(Sesso sesso) {
  switch (sesso) {
    case Sesso.maschio:
      return "Maschio";
    case Sesso.femmina:
      return "Femmina";
  }
}
