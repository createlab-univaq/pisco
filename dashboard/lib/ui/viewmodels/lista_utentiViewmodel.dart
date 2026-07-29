import 'package:flutter/material.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/data/service/lista_utentiService.dart';
import 'package:software_analista/data/repository/lista_utentiRepository.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class lista_utentiViewmodel extends ChangeNotifier {
  final ListaUtentiRepository _repository = ListaUtentiRepository(
    ListaUtentiService(),
  );
  List<Utente> _utenti = [];
  bool _isLoading = false;
  bool _selectionMode = false;
  Set<String> _selectedUserIds = {};

  List<Utente> get utenti => _utenti;
  bool get isLoading => _isLoading;
  bool get selectionMode => _selectionMode;
  Set<String> get selectedUserIds => _selectedUserIds;

  void clearUtenti() {
    _utenti = [];
    _selectedUserIds.clear();
    _selectionMode = false;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadUtenti() async {
    try {
      _isLoading = true;
      notifyListeners();

      await Future.delayed(const Duration(milliseconds: 500));
      _utenti = await _repository.listaUtenti();
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      print('Errore caricamento utenti: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Aggiunge un nuovo utente (opzionale)
  void aggiungiUtente(Utente nuovoUtente) {
    _utenti.add(nuovoUtente);
    notifyListeners();
  }

  // Aggiorna un utente esistente (opzionale)
  void aggiornaUtente(Utente utenteAggiornato) {
    final index = _utenti.indexWhere((b) => b.id == utenteAggiornato.id);
    if (index != -1) {
      _utenti[index] = utenteAggiornato;
      notifyListeners();
    }
  }

  int calcolaEta(DateTime dataNascita) {
    final now = DateTime.now();
    int anni = now.year - dataNascita.year;
    if (now.month < dataNascita.month ||
        (now.month == dataNascita.month && now.day < dataNascita.day)) {
      anni--;
    }
    return anni;
  }

  void toggleSelectionMode() {
    _selectionMode = !_selectionMode;
    _selectedUserIds.clear();
    notifyListeners();
  }

  void toggleUserSelection(String id) {
    if (_selectedUserIds.contains(id)) {
      _selectedUserIds.remove(id);
    } else {
      _selectedUserIds.add(id);
    }
    notifyListeners();
  }

  bool isSelected(String id) {
    return _selectedUserIds.contains(id);
  }

  Future<void> deleteSelectedUtenti() async {
    await _repository.deleteUtenti(_selectedUserIds.toList());

    _selectedUserIds.clear();
    _selectionMode = false;

    await loadUtenti();

    notifyListeners();
  }
}
