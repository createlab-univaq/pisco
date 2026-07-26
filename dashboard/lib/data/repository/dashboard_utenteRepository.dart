import 'package:software_analista/data/service/dashboard_utenteService.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/diagnosi.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';

class DashboardUtenterepository {
  final DashboardUtenteService service;

  DashboardUtenterepository(this.service);

  Future<List<Test>> getTestByUtente(String? codiceGioco) {
    return service.getTestByUtente(codiceGioco);
  }

  Future<Utente> salvaDiagnosi(String? utenteId, Diagnosi diagnosi) {
    return service.salvaDiagnosi(utenteId, diagnosi);
  }

  Future<Utente> eliminaDiagnosi(String? utenteId) {
    return service.eliminaDiagnosi(utenteId);
  }

  Future<String?> downloadExcel(String utenteId, String nomeUtente) async {
    return service.downloadExcel(utenteId, nomeUtente);
  }

  Future<void> rimuoviPercorso(String utenteId, String percorsoId) async {
    await service.rimuoviPercorsoUtente(utenteId, percorsoId);
  }
}
