import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/token_storage.dart';
import '../../domain/models/utente.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ListaUtentiService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  Future<List<Utente>> listaUtenti() async {
    final token = await TokenStorage.getToken();

    final response = await http.get(
      Uri.parse('$baseUrl/utente'),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    await ApiResponseHandler.checkAuthResponse(response);
    if (response.statusCode != 200) {
      throw Exception('Errore caricamento utenti');
    }

    final List data = jsonDecode(response.body);

    // Parse per record: a single malformed document used to throw out of the
    // whole .map(), which the viewmodel swallowed -- leaving the list empty
    // with no visible error even though the API had returned every user.
    final utenti = <Utente>[];
    for (final raw in data) {
      try {
        utenti.add(Utente.fromJson(raw as Map<String, dynamic>));
      } catch (e) {
        print('Utente non parsabile (_id: ${raw is Map ? raw['_id'] : '?'}): $e');
      }
    }

    if (utenti.length != data.length) {
      print('Utenti scartati: ${data.length - utenti.length} su ${data.length}');
    }

    return utenti;
  }

  Future<void> deleteUtenti(List<String> userIds) async {
    final token = await TokenStorage.getToken();

    final response = await http.post(
      Uri.parse('$baseUrl/utenti/delete'),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({"userIds": userIds}),
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception("Errore eliminazione utenti");
    }
  }
}
