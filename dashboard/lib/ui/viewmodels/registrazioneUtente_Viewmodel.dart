import 'package:flutter/material.dart';
import 'package:software_analista/data/repository/registrazione_utentiRepository.dart';
import 'package:software_analista/domain/enums/scuola.dart';
import 'package:software_analista/domain/enums/titoloStudio.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/domain/enums/sesso.dart';
import 'package:software_analista/utils/session_expired_exception.dart';
import 'package:software_analista/utils/validazione_titolo_scuole.dart';

class Registrazioneutente_Viewmodel extends ChangeNotifier {
  String nome = '';
  String cognome = '';
  DateTime? dataNascita;
  Sesso sesso = Sesso.maschio;
  String? email;
  String? telefono;
  Scuole? scuolaFrequentata;
  TitoloStudio? titoloStudio;
  Percorso? percorso;
  bool isLoading = true;
  String? errorMessage;
  final RegistrazioneUtenteRepository repository;

  Registrazioneutente_Viewmodel({required this.repository}) {
    _initForm();
  }

  Future<void> _initForm() async {
    await Future.delayed(
      const Duration(milliseconds: 300),
    ); // Simula caricamento
    isLoading = false;
    nome = '';
    cognome = '';
    sesso = Sesso.maschio;
    dataNascita = null;
    email = null;
    telefono = null;
    scuolaFrequentata = null;
    titoloStudio = null;
    errorMessage = null;

    notifyListeners();
  }

  void updateNome(String value) {
    nome = value;
    notifyListeners();
  }

  void updateCognome(String value) {
    cognome = value;
    notifyListeners();
  }

  void updateDataNascita(DateTime value) {
    dataNascita = value;
    notifyListeners();
  }

  void updateSesso(Sesso? value) {
    sesso = value!;
    notifyListeners();
  }

  void updateEmail(String? value) {
    email = value;
    notifyListeners();
  }

  void updateTelefono(String? value) {
    telefono = value;
    notifyListeners();
  }

  void updateScuola(Scuole? value) {
    if (value != null) {
      scuolaFrequentata = value;
      notifyListeners();
    }
  }

  void updateTitolo(TitoloStudio? value) {
    if (value != null) {
      titoloStudio = value;
      notifyListeners();
    }
  }

  // -----------------------------
  // VALIDAZIONE
  // -----------------------------
  bool _validateEmail(String? email) {
    if (email == null || email.isEmpty) return true; // opzionale
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return regex.hasMatch(email);
  }

  bool _validateTelefono(String? telefono) {
    if (telefono == null || telefono.isEmpty) return true; // opzionale
    final regex = RegExp(r'^\+?\d{7,15}$'); // accetta numeri con eventuale +
    return regex.hasMatch(telefono);
  }

  bool _isCoerente(Scuole scuola, TitoloStudio titolo) {
    final scuoleValide = titoloToScuoleValide[titolo];
    return scuoleValide?.contains(scuola) ?? false;
  }

  Future<Utente?> registraUtente() async {
    if (nome.isEmpty ||
        cognome.isEmpty ||
        dataNascita == null ||
        scuolaFrequentata == null ||
        titoloStudio == null) {
      errorMessage = 'Compila tutti i campi obbligatori';
      notifyListeners();
      return null;
    }

    if (!_validateEmail(email)) {
      errorMessage = 'Email non valida';
      notifyListeners();
      return null;
    }

    if (!_validateTelefono(telefono)) {
      errorMessage = 'Numero di telefono non valido';
      notifyListeners();
      return null;
    }

    if (!_isCoerente(scuolaFrequentata!, titoloStudio!)) {
      errorMessage = 'Scuola frequentata e titolo di studio non coerenti';
      notifyListeners();
      return null;
    }

    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      final utente = Utente(
        id: null,
        nome: nome,
        cognome: cognome,
        dataDiNascita: dataNascita!,
        sesso: sesso,
        email: email,
        numTelefono: telefono,
        scuolaFrequentata: scuolaFrequentata!,
        titoloStudio: titoloStudio!,
        codiceGioco: null,
      );

      final utenteCreato = await repository.creaUtente(utente);
      return utenteCreato;
    } catch (e) {
      if (e is SessionExpiredException) {
        rethrow;
      }
      errorMessage = 'Errore durante la registrazione: $e';
      notifyListeners();
      return null;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
