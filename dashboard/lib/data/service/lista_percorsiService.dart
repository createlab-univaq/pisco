import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/utils/api_response_handler.dart';

class PercorsiService {
  Future<List<Percorso>> fetchPercorsi() async {
    final uri = Uri.https("piscoaq-editor.polyglot-edu.com", "/api/flows", {
      "me": "true",
    });

    final response = await http.get(uri);

    await ApiResponseHandler.checkAuthResponse(response);

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Percorso.fromJson(e)).toList();
    } else {
      throw Exception("Errore API: ${response.statusCode}");
    }
  }
}
