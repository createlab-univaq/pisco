class SessionExpiredException implements Exception {
  final String message;

  SessionExpiredException([this.message = "Sessione scaduta"]);

  @override
  String toString() => message;
}
