import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/ui/viewmodels/home_viewmodel.dart';
import 'package:software_analista/ui/widgets/Datacard.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/ui/widgets/grafico_lineare.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => HomeViewModel(),
      child: Consumer<HomeViewModel>(
        builder: (context, vm, _) {
          return Scaffold(
            backgroundColor: Colors.white,
            body: Row(
              children: [
                // Sidebar
                Sidebar(),

                // Contenuto principale
                Expanded(
                  child: Column(
                    children: [
                      // TopBar
                      TopBar(),

                      // Corpo pagina
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: vm.isLoading
                              ? const Center(
                                  child: CircularProgressIndicator(),
                                )
                              : SingleChildScrollView(
                                  child: Column(
                                    crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                    children: [

                                    // =============================
                                    // CARD STATISTICHE
                                    // =============================
                                      SizedBox(
                                        height: 160,
                                        child: GridView.count(
                                          crossAxisCount: 4,
                                          childAspectRatio: 2,
                                          crossAxisSpacing: 24,
                                          mainAxisSpacing: 24,
                                          physics:
                                            const NeverScrollableScrollPhysics(),
                                          children: [
                                            DataCard(
                                              icon: Icons.person,
                                              title: 'Utenti registrati',
                                              value: vm.numeroUtenti.toString(),
                                              color: Colors.green,
                                            ),
                                            DataCard(
                                              icon: Icons.male,
                                              title: 'Maschi',
                                              value: vm.numeroMaschi.toString(),
                                              color: Colors.blue,
                                            ),
                                            DataCard(
                                              icon: Icons.female,
                                              title: 'Femmine',
                                              value:
                                                vm.numeroFemmine.toString(),
                                              color: Colors.pink,
                                            ),
                                            DataCard(
                                              icon: Icons.alt_route,
                                              title: 'Percorsi',
                                              value: 
                                                vm.numeroPercorsi.toString(),
                                              color: Colors.orange,
                                            ),
                                          ],
                                        ),
                                      ),

                                      const SizedBox(height: 40),

                                    // =============================
                                    // TABELLA TEST
                                    // =============================
                                      Container(
                                          padding:
                                            const EdgeInsets.all(20),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius:
                                              BorderRadius.circular(16),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.white
                                                  .withOpacity(0.1),
                                                blurRadius: 10,
                                                offset:
                                                  const Offset(0, 4),
                                              ),
                                            ],
                                          ),
                                          child: SingleChildScrollView(
                                            scrollDirection:
                                              Axis.horizontal,
                                            child: DataTable(
                                              columnSpacing: 40,
                                              headingRowColor:
                                                MaterialStateProperty
                                                    .all(Colors.black),
                                              headingTextStyle: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold
                                              ),
                                              columns: const [
                                                DataColumn(
                                                  label: Text(
                                                      'Nome Test')),
                                                DataColumn(
                                                  label: Text('% superamento test pre-esercitazione')),
                                                DataColumn(
                                                  label: Text(
                                                      '% superamento test post-esercitazione')),
                                                DataColumn(
                                                  label: Text(
                                                      'Tempo medio di reazione')),
                                              ],
                                              rows: vm.stats.map((test) {
                                                return DataRow(
                                                  cells: [
                                                    DataCell(Text(
                                                      test.nomeTest)),
                                                    DataCell(Text(
                                                      '${test.percentualePre.toStringAsFixed(1)}%')),
                                                    DataCell(Text(
                                                      '${test.percentualePost.toStringAsFixed(1)}%')),
                                                    DataCell(Text(
                                                      '${test.tempoMedio.toStringAsFixed(2)} ms')),
                                                  ],
                                                );
                                              }).toList(),
                                            ),
                                          ),
                                        ),

                                      const SizedBox(height: 40),

                                      if(vm.chartData.isNotEmpty)
                                        LineChartWidget(
                                          data: vm.chartData,
                                          title: 'Media risposte corrette per test',
                                          xAxisTitle: 'Test',
                                          yAxisTitle: 'Media corrette',
                                        ),
                                      
                                      const SizedBox(height: 40),

                  
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
