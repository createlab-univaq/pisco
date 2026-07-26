import '../service/authService.dart';

class AuthRepository {
  final AuthService service;

  AuthRepository(this.service);

  Future<String> login(String email, String password) {
    return service.login(email, password);
  }

  Future<void> register({
    required String nome,
    required String cognome,
    required String dataNascita,
    required String email,
    required String password,
  }) {
    return service.register(
      nome: nome,
      cognome: cognome,
      dataNascita: dataNascita,
      email: email,
      password: password,
    );
  }
}
