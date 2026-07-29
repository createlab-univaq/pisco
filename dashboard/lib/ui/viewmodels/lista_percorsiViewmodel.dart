import 'package:flutter/foundation.dart';
import 'package:software_analista/data/repository/lista_percorsiRepository.dart';
import 'package:software_analista/data/service/lista_percorsiService.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class lista_percorsiViewModel extends ChangeNotifier {
  final PercorsiRepository repository = PercorsiRepository(PercorsiService());
  List<Percorso> _percorsi = [];
  bool _isLoading = true;
  String? errorMessage;

  lista_percorsiViewModel() {
    loadPercorsi();
  }

  List<Percorso> get percorsi => _percorsi;
  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> loadPercorsi() async {
    isLoading = true;
    notifyListeners();

    try {
      await Future.delayed(const Duration(milliseconds: 300));

      _percorsi = await repository.getPercorsi();

      errorMessage = null;
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      errorMessage = "Errore nel caricamento dei percorsi: ${e}";
    }

    isLoading = false;
    notifyListeners();
  }
}
