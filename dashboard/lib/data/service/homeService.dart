import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:software_analista/domain/models/risultatoTest.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:software_analista/utils/api_response_handler.dart';
import 'package:software_analista/utils/token_storage.dart';

class HomeService {
  static final String baseUrl =
      dotenv.env['API_URL'] ?? "http://localhost:3000";

  Future<List<Test>> getAllTentativi() async {
    final token = await TokenStorage.getToken();

    final response = await http.get(
      Uri.parse('$baseUrl/api/tentativi-test/tutti'),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode != 200) {
      throw Exception('Errore caricamento tentativi');
    }

    final List data = jsonDecode(response.body);
    return data.map((e) => Test.fromJson(e)).toList();
  }
}
