import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/token_storage.dart';
import '../../domain/models/utente.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class RegistrazioneUtenteService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  Future<Utente> creaUtente(Utente utente) async {
    final token = await TokenStorage.getToken();

    final response = await http.post(
      Uri.parse('$baseUrl/utente'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(utente.toJson()),
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode == 201) {
      final map = jsonDecode(response.body);
      return Utente.fromJson(map['nuovoUtente']);
    } else {
      throw Exception(
        'Errore creazione utente: ${response.statusCode} ${response.body}',
      );
    }
  }
}
