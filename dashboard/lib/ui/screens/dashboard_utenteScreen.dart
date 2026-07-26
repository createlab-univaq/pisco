import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/data/repository/dashboard_utenteRepository.dart';
import 'package:software_analista/ui/viewmodels/dashboard_utenteViewmodel.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/ui/widgets/DiagnosiSection.dart';
import 'package:software_analista/ui/widgets/TestTable.dart';
import 'package:software_analista/ui/widgets/UserInfoCard.dart';
import 'package:software_analista/ui/widgets/codiceutenteRow.dart';
import 'package:software_analista/ui/widgets/dashboardHeader.dart';
import 'package:software_analista/ui/widgets/grafico_lineare.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/utils/session_expired_exception.dart';

class Dashboard_utenteScreen extends StatefulWidget {
  final Utente utente;
  final DashboardUtenterepository repository;

  const Dashboard_utenteScreen({
    super.key,
    required this.utente,
    required this.repository,
  });

  @override
  State<Dashboard_utenteScreen> createState() => _Dashboard_utenteScreenState();
}

class _Dashboard_utenteScreenState extends State<Dashboard_utenteScreen> {
  late DashboardUtenteViewModel _vm;
  bool gestionePercorsiMode = false;

  @override
  void initState() {
    super.initState();

    _vm = DashboardUtenteViewModel(
      utente: widget.utente,
      repository: widget.repository,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _vm.initialize().catchError((e) {
        if (e is! SessionExpiredException) {
          debugPrint('Errore inizializzazione dashboard utente: $e');
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _vm,
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Row(
          children: [
            Sidebar(),

            /// CONTENUTO PRINCIPALE
            Expanded(
              child: Column(
                children: [
                  TopBar(),

                  /// CONTENUTO DASHBOARD
                  Expanded(
                    child: Consumer<DashboardUtenteViewModel>(
                      builder: (context, vm, _) {
                        if (vm.isLoading) {
                          return const Center(
                            child: CircularProgressIndicator(),
                          );
                        }

                        final Utente utente = vm.utente;

                        return SingleChildScrollView(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              DashboardHeader(
                                nome: utente.nome,
                                cognome: utente.cognome,
                              ),

                              const SizedBox(height: 16),

                              /// DATI UTENTE
                              UserInfoCard(
                                utente: utente,
                                gestionePercorsiMode: gestionePercorsiMode,
                                onRemovePercorso: (percorsoId) async {
                                  final conferma = await showDialog<bool>(
                                    context: context,
                                    builder:
                                        (_) => AlertDialog(
                                          title: const Text(
                                            "Conferma eliminazione",
                                          ),
                                          content: const Text(
                                            "Vuoi davvero rimuovere questo percorso dall'utente?",
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed:
                                                  () => Navigator.pop(
                                                    context,
                                                    false,
                                                  ),
                                              child: const Text("Annulla"),
                                            ),
                                            ElevatedButton(
                                              onPressed:
                                                  () => Navigator.pop(
                                                    context,
                                                    true,
                                                  ),
                                              child: const Text("Conferma"),
                                            ),
                                          ],
                                        ),
                                  );
                                  if (conferma == true) {
                                    await vm.rimuoviPercorso(percorsoId);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          "Percorso rimosso con successo",
                                        ),
                                      ),
                                    );
                                  }
                                },
                              ),

                              /// Codice utente
                              ///CodiceUtenteRow(codice: utente.codiceGioco),
                              const SizedBox(height: 16),

                              const SizedBox(height: 16),

                              Row(
                                children: [
                                  ElevatedButton.icon(
                                    icon: const Icon(Icons.download),
                                    label: const Text("Scarica report Excel"),
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 20,
                                        vertical: 14,
                                      ),
                                      textStyle: const TextStyle(fontSize: 15),
                                      backgroundColor: Colors.black,
                                      foregroundColor: Colors.white,
                                    ),
                                    onPressed:
                                        vm.isLoading
                                            ? null
                                            : () async {
                                              try {
                                                await vm.esportaExcel(
                                                  utente.id!,
                                                  utente.nome,
                                                );

                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  const SnackBar(
                                                    content: Text(
                                                      "Report Excel scaricato con successo",
                                                    ),
                                                  ),
                                                );
                                              } catch (e) {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  const SnackBar(
                                                    content: Text(
                                                      "Errore durante il download del report",
                                                    ),
                                                    backgroundColor: Colors.red,
                                                  ),
                                                );
                                              }
                                            },
                                  ),

                                  const SizedBox(width: 16),

                                  ElevatedButton.icon(
                                    icon: const Icon(Icons.route),
                                    label: const Text(
                                      "Gestione percorsi utente",
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 20,
                                        vertical: 14,
                                      ),
                                      textStyle: const TextStyle(fontSize: 15),
                                      backgroundColor: Colors.black,
                                      foregroundColor: Colors.white,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        gestionePercorsiMode =
                                            !gestionePercorsiMode;
                                      });
                                    },
                                  ),
                                ],
                              ),

                              const SizedBox(height: 32),

                              /// TEST PRE
                              TestTable(
                                tests: vm.testPre,
                                titolo: "Test Pre-Esercitazione",
                              ),

                              const SizedBox(height: 32),

                              /// TEST POST
                              TestTable(
                                tests: vm.testPost,
                                titolo: "Test Post-Esercitazione",
                              ),

                              const SizedBox(height: 32),

                              Column(
                                children: [
                                  if (vm.progressiPreChartData.isNotEmpty)
                                    LineChartWidget(
                                      data: vm.progressiPreChartData,
                                      title: 'Andamento Test Pre',
                                      xAxisTitle: 'Test Pre',
                                      yAxisTitle: 'Punteggio',
                                      maxY: vm.maxPreY,
                                    ),
                                  if (vm.progressiPostChartData.isNotEmpty)
                                    LineChartWidget(
                                      data: vm.progressiPostChartData,
                                      title: 'Andamento Test Post',
                                      xAxisTitle: 'Test Post',
                                      yAxisTitle: 'Punteggio',
                                      maxY: vm.maxPostY,
                                    ),
                                ],
                              ),

                              const SizedBox(height: 32),

                              /// DIAGNOSI
                              const DiagnosiSection(),

                              const SizedBox(height: 32),
                            ],
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
      ),
    );
  }
}
