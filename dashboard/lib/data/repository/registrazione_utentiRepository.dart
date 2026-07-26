import 'package:software_analista/data/service/registrazione_utentiService.dart';
import 'package:software_analista/domain/models/utente.dart';

class RegistrazioneUtenteRepository {
  final RegistrazioneUtenteService service;

  RegistrazioneUtenteRepository({required this.service});

  Future<Utente> creaUtente(Utente utente) {
    return service.creaUtente(utente);
  }
}