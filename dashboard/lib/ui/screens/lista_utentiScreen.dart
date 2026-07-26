import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/data/service/dashboard_utenteService.dart';
import 'package:software_analista/ui/screens/dashboard_utenteScreen.dart';
import 'package:software_analista/ui/screens/registrazione_utenteScreen.dart';
import 'package:software_analista/ui/viewmodels/lista_utentiViewmodel.dart';
import 'package:software_analista/ui/widgets/UtenteCard.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/data/repository/dashboard_utenteRepository.dart';
import 'package:software_analista/ui/widgets/deleteDialog.dart';
import 'package:software_analista/utils/appState.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class Lista_utentiScreen extends StatefulWidget {
  const Lista_utentiScreen({super.key});

  @override
  State<Lista_utentiScreen> createState() => _Lista_utentiScreenState();
}

class _Lista_utentiScreenState extends State<Lista_utentiScreen> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final appState = context.read<AppState>();
    final vm = context.read<lista_utentiViewmodel>();

    if (appState.needsRefreshUtenti) {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        try {
          await vm.loadUtenti();
        } catch (e) {
          if (e is SessionExpiredException) {
            Navigator.pushNamedAndRemoveUntil(
              context,
              '/login',
              (route) => false,
            );
          }
        }
      });
      appState.clearUtentiDirty();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Row(
        children: [
          /// SIDEBAR
          Sidebar(),

          /// CONTENUTO PRINCIPALE
          Expanded(
            child: Column(
              children: [
                /// TOPBAR
                TopBar(),

                /// TITOLO
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  child: const Text(
                    "Elenco Utenti",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),

                /// AZIONI
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      /// AGGIUNGI UTENTE
                      ElevatedButton.icon(
                        icon: const Icon(Icons.person_add, color: Colors.white),
                        label: const Text(
                          "Aggiungi utente",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        onPressed: () async {
                          final nuovoUtente = await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const RegistrazioneUtenteScreen(),
                            ),
                          );

                          if (nuovoUtente != null) {
                            final vm = context.read<lista_utentiViewmodel>();
                            vm.aggiungiUtente(nuovoUtente);
                          }
                        },
                      ),

                      const SizedBox(width: 10),

                      Consumer<lista_utentiViewmodel>(
                        builder: (context, vm, _) {
                          return Row(
                            children: [
                              if (vm.selectionMode)
                                ElevatedButton.icon(
                                  icon: const Icon(Icons.delete),
                                  label: const Text("Elimina"),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                  ),
                                  onPressed:
                                      vm.selectedUserIds.isEmpty
                                          ? null
                                          : () async {
                                            final result = await showDialog(
                                              context: context,
                                              builder: (_) => DeleteDialog(),
                                            );

                                            if (result == true) {
                                              await vm.deleteSelectedUtenti();

                                              ScaffoldMessenger.of(
                                                context,
                                              ).showSnackBar(
                                                const SnackBar(
                                                  content: Text(
                                                    "Utenti eliminati con successo",
                                                  ),
                                                ),
                                              );
                                            }
                                          },
                                ),

                              const SizedBox(width: 10),

                              ElevatedButton.icon(
                                icon: Icon(
                                  vm.selectionMode
                                      ? Icons.close
                                      : Icons.delete_forever,
                                ),
                                label: Text(
                                  vm.selectionMode
                                      ? "Annulla"
                                      : "Elimina utenti",
                                ),
                                onPressed: vm.toggleSelectionMode,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.black,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ],
                  ),
                ),

                /// LISTA
                Expanded(child: _buildContenuto()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContenuto() {
    return Consumer<lista_utentiViewmodel>(
      builder: (context, vm, _) {
        if (vm.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (vm.utenti.isEmpty) {
          return const Center(
            child: Text(
              "Nessun utente presente",
              style: TextStyle(fontSize: 18),
            ),
          );
        }

        return Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: vm.utenti.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final utente = vm.utenti[index];

                return UtenteCard(
                  utente: utente,
                  selectionMode: vm.selectionMode,
                  isSelected: vm.isSelected(utente.id!),
                  onSelect: () => vm.toggleUserSelection(utente.id!),
                  onTap:
                      vm.selectionMode
                          ? () => vm.toggleUserSelection(utente.id!)
                          : () async {
                            final testService = DashboardUtenteService();

                            await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (_) => Dashboard_utenteScreen(
                                      utente: utente,
                                      repository: DashboardUtenterepository(
                                        testService,
                                      ),
                                    ),
                              ),
                            );

                            // ❌ niente più vm.loadUtenti()
                          },
                );
              },
            ),
          ),
        );
      },
    );
  }
}
