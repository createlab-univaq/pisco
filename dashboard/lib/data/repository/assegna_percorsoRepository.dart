import 'package:software_analista/data/service/assegna_percorsoService.dart';
import 'package:software_analista/domain/models/utente.dart';

class AssegnaPercorsoRepository {
  final AssegnaPercorsoService service;

  AssegnaPercorsoRepository(this.service);

  Future<Utente> assegnaPercorso(String? utenteId, String percorsoIdEsterno, String nomePercorso ) {
    return service.assegnaPercorso(utenteId: utenteId, percorsoIdEsterno: percorsoIdEsterno, nomePercorso: nomePercorso);
  }
}