import 'package:flutter/foundation.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/data/repository/assegna_percorsoRepository.dart';
import 'package:software_analista/domain/models/percorsoAssegnato.dart';
import 'package:software_analista/utils/appState.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class AssegnaPercorsoViewModel extends ChangeNotifier {
  final AssegnaPercorsoRepository _repository;

  Utente? _utenteSelezionato;
  Percorso? _percorsoSelezionato;
  bool _isLoading = false;
  String? errore;
  final AppState appState;

  AssegnaPercorsoViewModel(this._repository, this.appState);

  // ===============================
  // GETTERS
  // ===============================
  Utente? get utente => _utenteSelezionato;
  Percorso? get percorso => _percorsoSelezionato;
  bool get isLoading => _isLoading;

  List<PercorsoAssegnato> get percorsiAssegnati =>
      _utenteSelezionato?.percorsiAssegnati ?? [];

  // ===============================
  // SELEZIONE
  // ===============================

  void selezionaUtente(Utente u) {
    _utenteSelezionato = u;
    notifyListeners();
  }

  void selezionaPercorso(Percorso p) {
    _percorsoSelezionato = p;
    notifyListeners();
  }

  /// Conferma l'assegnazione del percorso all'utente
  Future<void> confermaAssociazione() async {
    _setLoading(true);

    try {
      final utenteAggiornato = await _repository.assegnaPercorso(
        _utenteSelezionato!.id,
        _percorsoSelezionato!.id,
        _percorsoSelezionato!.title,
      );

      _utenteSelezionato = utenteAggiornato;
      appState.markUtentiDirty();
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      errore = 'Errore durante assegnazione percorso: $e';
    }

    _setLoading(false);
    notifyListeners();
  }

  // ===============================
  // UTILS
  // ===============================
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
