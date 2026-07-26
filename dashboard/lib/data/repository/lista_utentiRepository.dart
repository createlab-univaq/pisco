import 'package:software_analista/data/service/lista_utentiService.dart';
import 'package:software_analista/domain/models/utente.dart';

class ListaUtentiRepository {
  final ListaUtentiService service;

  ListaUtentiRepository(this.service);

  Future<List<Utente>> listaUtenti() {
    return service.listaUtenti();
  }

  Future<void> deleteUtenti(List<String> userIds) {
    return service.deleteUtenti(userIds);
  }
}
