import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/diagnosi.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/foundation.dart';
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/download_stub.dart'
    if (dart.library.html) 'package:software_analista/utils/download_web.dart';
import 'package:software_analista/utils/token_storage.dart';

class DashboardUtenteService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  Future<List<Test>> getTestByUtente(String? codiceGioco) async {
    final token = await TokenStorage.getToken();

    final response = await http.get(
      Uri.parse('$baseUrl/api/tentativi-test/tentativi/$codiceGioco'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore caricamento utenti');
    }

    final List data = jsonDecode(response.body);
    return data.map((e) => Test.fromJson(e)).toList();
  }

  Future<Utente> salvaDiagnosi(String? utenteId, Diagnosi diagnosi) async {
    final token = await TokenStorage.getToken();

    final response = await http.put(
      Uri.parse('$baseUrl/utenti/$utenteId/diagnosi'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'testo': diagnosi.testo,
        'livelloGravita': diagnosi.livelloGravita.name,
        'note': diagnosi.note,
      }),
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore salvataggio diagnosi');
    }

    return Utente.fromJson(jsonDecode(response.body));
  }

  Future<Utente> eliminaDiagnosi(String? utenteId) async {
    final token = await TokenStorage.getToken();

    final response = await http.delete(
      Uri.parse('$baseUrl/utenti/$utenteId/diagnosi'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore eliminazione diagnosi');
    }

    return Utente.fromJson(jsonDecode(response.body));
  }

  Future<String?> downloadExcel(String utenteId, String nomeUtente) async {
    final token = await TokenStorage.getToken();

    final response = await http.get(
      Uri.parse('$baseUrl/export/excel/$utenteId'),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore download Excel: ${response.statusCode}');
    }

    final bytes = response.bodyBytes;

    if (kIsWeb) {
      downloadFile(bytes, 'report_$nomeUtente.xlsx');
      return null;
    }

    // Ottieni la cartella Documenti o temporanea
    final dir =
        await getDownloadsDirectory() ??
        await getApplicationDocumentsDirectory();

    final filePath = '${dir.path}/report_$nomeUtente.xlsx';

    // Scrivi il file su disco
    final file = File(filePath);
    await file.writeAsBytes(bytes);

    // Apri il file (opzionale)
    OpenFile.open(filePath);

    return filePath;
  }

  Future<void> rimuoviPercorsoUtente(String utenteId, String percorsoId) async {
    final token = await TokenStorage.getToken();

    final response = await http.delete(
      Uri.parse('$baseUrl/utenti/$utenteId/percorsi/$percorsoId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore durante la rimozione del percorso');
    }
  }
}
