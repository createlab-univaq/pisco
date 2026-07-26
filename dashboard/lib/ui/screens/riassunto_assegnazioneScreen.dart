import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/data/repository/assegna_percorsoRepository.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/ui/viewmodels/assegna_percorsoViewmodel.dart';
import 'package:software_analista/ui/widgets/UtenteCard.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/ui/widgets/percorso_card.dart';
import 'package:software_analista/utils/appState.dart';

class AssegnazioneRiassuntoScreen extends StatelessWidget {
  final Utente utente;
  final Percorso percorso;

  const AssegnazioneRiassuntoScreen({
    super.key,
    required this.utente,
    required this.percorso,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AssegnaPercorsoViewModel>(
      create:
          (_) =>
              AssegnaPercorsoViewModel(
                  Provider.of<AssegnaPercorsoRepository>(
                    context,
                    listen: false,
                  ),
                  Provider.of<AppState>(context, listen: false),
                )
                ..selezionaUtente(utente)
                ..selezionaPercorso(percorso),
      child: Consumer<AssegnaPercorsoViewModel>(
        builder: (context, vm, _) {
          return Scaffold(
            backgroundColor: Colors.white,
            body: Row(
              children: [
                Sidebar(),
                Expanded(
                  child: Column(
                    children: [
                      TopBar(),

                      // Titolo fisso in alto e centrato
                      const Padding(
                        padding: EdgeInsets.fromLTRB(24, 24, 24, 0),
                        child: Center(
                          child: Text(
                            "Riepilogo assegnazione",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ),

                      // Contenuto centrato nel resto dello spazio
                      Expanded(
                        child: Center(
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 700),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Card + Freccia
                                Row(
                                  children: [
                                    Expanded(
                                      child: UtenteCard(utente: vm.utente!),
                                    ),
                                    const Padding(
                                      padding: EdgeInsets.symmetric(
                                        horizontal: 16,
                                      ),
                                      child: Icon(
                                        Icons.swap_horiz,
                                        size: 40,
                                        color: Colors.black,
                                      ),
                                    ),
                                    Expanded(
                                      child: PercorsoCard(
                                        percorso: vm.percorso!,
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 48),

                                // Bottone Conferma
                                SizedBox(
                                  width: 300,
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.black,
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 16,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    onPressed:
                                        vm.isLoading
                                            ? null
                                            : () async {
                                              await vm.confermaAssociazione();
                                              if (vm.errore == null) {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  const SnackBar(
                                                    content: Text(
                                                      'Percorso assegnato correttamente',
                                                    ),
                                                  ),
                                                );
                                                Navigator.pop(context);
                                              } else {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  SnackBar(
                                                    content: Text(vm.errore!),
                                                    backgroundColor: Colors.red,
                                                  ),
                                                );
                                              }
                                            },
                                    child:
                                        vm.isLoading
                                            ? const SizedBox(
                                              height: 20,
                                              width: 20,
                                              child: CircularProgressIndicator(
                                                color: Colors.white,
                                                strokeWidth: 2,
                                              ),
                                            )
                                            : const Text(
                                              'Conferma Assegnazione',
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
