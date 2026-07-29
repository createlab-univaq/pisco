import 'package:software_analista/domain/enums/scuola.dart';
import 'package:software_analista/domain/enums/titoloStudio.dart';

const Map<TitoloStudio, List<Scuole>> titoloToScuoleValide = {

  TitoloStudio.Diploma_di_terza_media: [
    Scuole.Scuola_secondaria_di_secondo_grado,
    Scuole.Non_frequento,
    Scuole.Altro,
  ],


  TitoloStudio.Diploma_di_scuola_superiore: [
    Scuole.Universita,
    Scuole.Non_frequento,
    Scuole.Altro,
  ],


  TitoloStudio.Laurea_di_I_livello: [
    Scuole.Universita,
    Scuole.Non_frequento,
    Scuole.Altro,
  ],

  TitoloStudio.Laurea_di_II_livello: [
    Scuole.Universita,
    Scuole.Non_frequento,
    Scuole.Altro,
  ],

  TitoloStudio.Master_dottorato_specializzazione: [
    Scuole.Universita,
    Scuole.Non_frequento,
    Scuole.Altro,
  ]
};