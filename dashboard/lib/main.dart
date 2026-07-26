import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/data/repository/assegna_percorsoRepository.dart';
import 'package:software_analista/data/repository/authRepository.dart';
import 'package:software_analista/data/service/assegna_percorsoService.dart';
import 'package:software_analista/data/service/authService.dart';
import 'package:software_analista/ui/screens/HomeScreen.dart';
import 'package:software_analista/ui/screens/loginScreen.dart';
import 'package:software_analista/ui/screens/registerScreen.dart';
import 'package:software_analista/ui/screens/splashScreen.dart';
import 'package:software_analista/ui/viewmodels/authViewmodel.dart';
import 'package:software_analista/ui/viewmodels/lista_utentiViewmodel.dart';
import 'package:software_analista/ui/viewmodels/lista_percorsiViewmodel.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:software_analista/utils/appState.dart';
import 'package:software_analista/utils/navigation_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<AssegnaPercorsoService>(
          create: (_) => AssegnaPercorsoService(),
        ),
        ProxyProvider<AssegnaPercorsoService, AssegnaPercorsoRepository>(
          update: (_, service, __) => AssegnaPercorsoRepository(service),
        ),
        ChangeNotifierProvider(create: (_) => lista_utentiViewmodel()),
        ChangeNotifierProvider(create: (_) => lista_percorsiViewModel()),
        ChangeNotifierProvider(create: (_) => AppState()),
        ChangeNotifierProvider(
          create: (_) => AuthViewModel(AuthRepository(AuthService())),
        ),
      ],
      child: MaterialApp(
        navigatorKey: NavigationService.navigatorKey,
        debugShowCheckedModeBanner: false,
        title: 'Software Analista',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),

        initialRoute: "/splash",

        routes: {
          "/splash": (_) => const SplashScreen(),
          "/login": (_) => const LoginScreen(),
          "/register": (_) => const RegisterScreen(),
          "/home": (_) => const HomeScreen(),
        },
      ),
    );
  }
}
