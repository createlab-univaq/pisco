import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/token_storage.dart';

class PercorsiService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  /// The catalogue lives in the Polyglot backend, but we go through game-api:
  /// calling that backend from the browser fails on CORS and it does not accept
  /// the analyst JWT. game-api proxies it server-side.
  Future<List<Percorso>> fetchPercorsi() async {
    final token = await TokenStorage.getToken();

    final uri = Uri.parse('$baseUrl/percorsi');

    final response = await http.get(
      uri,
      headers: {'Authorization': 'Bearer $token'},
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Percorso.fromJson(e)).toList();
    } else {
      throw Exception("Errore API: ${response.statusCode}");
    }
  }
}
