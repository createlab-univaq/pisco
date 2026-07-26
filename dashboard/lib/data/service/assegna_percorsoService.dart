import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:software_analista/domain/models/utente.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/token_storage.dart';

class AssegnaPercorsoService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  /// Assegna un percorso a un utente
  Future<Utente> assegnaPercorso({
    required String? utenteId,
    required String percorsoIdEsterno,
    required String nomePercorso,
  }) async {
    final token = await TokenStorage.getToken();

    final url = Uri.parse('$baseUrl/utenti/$utenteId/assegna-percorso');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'percorsoIdEsterno': percorsoIdEsterno,
        'nomePercorso': nomePercorso,
      }),
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode == 200) {
      final Map<String, dynamic> json = jsonDecode(response.body);
      return Utente.fromJson(json['utente']);
    } else {
      throw Exception('Errore assegnazione percorso (${response.statusCode})');
    }
  }
}
