import 'package:software_analista/data/service/lista_percorsiService.dart';
import 'package:software_analista/domain/models/percorso.dart';

class PercorsiRepository {
  final PercorsiService service;

  PercorsiRepository(this.service);

  Future<List<Percorso>> getPercorsi() {
    return service.fetchPercorsi();
  }
}