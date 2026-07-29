import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/ui/screens/HomeScreen.dart';
import 'package:software_analista/ui/viewmodels/lista_utentiViewmodel.dart';
import 'package:software_analista/utils/token_storage.dart';
import 'package:software_analista/ui/screens/lista_utentiScreen.dart';
import 'package:software_analista/ui/screens/lista_percorsiScreen.dart';
import 'package:software_analista/ui/screens/selezione_utenteScreen.dart';
import 'package:software_analista/ui/widgets/Sidebar_item.dart';

class Sidebar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          right: BorderSide(
            color: Colors.black,
            width: 2.5, // 👈 linea di separazione
          ),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 32),
          Text('PISCO', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 40),

          SidebarItem(
            icon: Icons.home,
            label: 'Home',
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => HomeScreen()),
              );
            },
          ),
          SidebarItem(
            icon: Icons.person,
            label: 'Utenti',
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => Lista_utentiScreen()),
              );
            },
          ),
          SidebarItem(
            icon: Icons.list,
            label: 'Percorsi',
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => ListaPercorsiScreen()),
              );
            },
          ),
          SidebarItem(
            icon: Icons.route,
            label: 'Assegnazione',
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => SelezioneUtenteScreen()),
              );
            },
          ),

          const SizedBox(height: 10),

          SidebarItem(
            icon: Icons.logout_outlined,
            label: 'Logout',
            onTap: () async {
              final conferma = await showDialog<bool>(
                context: context,
                builder:
                    (_) => AlertDialog(
                      title: const Text("Logout"),
                      content: const Text("Vuoi uscire dall'app?"),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text("Annulla"),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text("Esci"),
                        ),
                      ],
                    ),
              );

              if (conferma == true) {
                await TokenStorage.clearToken();
                if (context.mounted) {
                  context.read<lista_utentiViewmodel>().clearUtenti();
                }

                if (context.mounted) {
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    "/login",
                    (route) => false,
                  );
                }
              }
            },
          ),
        ],
      ),
    );
  }
}
