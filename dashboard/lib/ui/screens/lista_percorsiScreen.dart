import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/ui/viewmodels/lista_percorsiViewmodel.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/ui/widgets/percorso_card.dart';

class ListaPercorsiScreen extends StatefulWidget {
  const ListaPercorsiScreen({super.key});

  @override
  State<ListaPercorsiScreen> createState() => _ListaPercorsiScreenState();
}

class _ListaPercorsiScreenState extends State<ListaPercorsiScreen> {
  @override
  void initState() {
    super.initState();
    // Carichiamo subito i percorsi quando lo screen viene costruito
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final vm = context.read<lista_percorsiViewModel>();
      vm.loadPercorsi();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Row(
        children: [
          // Sidebar
          Sidebar(),

          // Contenuto principale
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // TopBar
                TopBar(),

                // Titolo della pagina
                Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 600),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      child: Text(
                        "Percorsi disponibili",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                ),

                // Contenuto della pagina (lista percorsi)
                Expanded(
                  child: Consumer<lista_percorsiViewModel>(
                    builder: (context, vm, _) {
                      if (vm.isLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (vm.percorsi.isEmpty) {
                        return const Center(
                          child: Text(
                            "Nessun percorso registrato",
                            style: TextStyle(fontSize: 18),
                          ),
                        );
                      }

                      return Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 600),
                          child: ListView.separated(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            itemCount: vm.percorsi.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final percorso = vm.percorsi[index];
                              return PercorsoCard(
                                percorso: percorso,
                                onTap: () {},
                              );
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}