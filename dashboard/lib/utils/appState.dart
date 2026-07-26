import 'package:flutter/material.dart';

class AppState extends ChangeNotifier {
  bool _needsRefreshUtenti = false;

  bool get needsRefreshUtenti => _needsRefreshUtenti;

  void markUtentiDirty() {
    _needsRefreshUtenti = true;
    notifyListeners();
  }

  void clearUtentiDirty() {
    _needsRefreshUtenti = false;
  }
}
