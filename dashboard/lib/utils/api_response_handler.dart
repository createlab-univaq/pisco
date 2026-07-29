import 'package:http/http.dart' as http;
import 'package:software_analista/utils/session_manager.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class ApiResponseHandler {
  static Future<void> checkAuthResponse(http.Response response) async {
    if (response.statusCode == 401) {
      await SessionManager.handleExpiredSession();

      throw SessionExpiredException();
    }
  }
}
