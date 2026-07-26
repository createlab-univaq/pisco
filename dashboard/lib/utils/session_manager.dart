import 'package:flutter/material.dart';
import 'package:software_analista/utils/navigation_service.dart';
import 'package:software_analista/utils/token_storage.dart';

class SessionManager {
  static bool _isRedirecting = false;

  static Future<void> handleExpiredSession() async {
    await TokenStorage.clearToken();

    if (_isRedirecting) return;
    _isRedirecting = true;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final navigator = NavigationService.navigatorKey.currentState;

      if (navigator != null) {
        navigator.pushNamedAndRemoveUntil('/login', (route) => false);
      }

      _isRedirecting = false;
    });
  }
}
