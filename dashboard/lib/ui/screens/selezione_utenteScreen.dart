import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/ui/screens/selezione_percorsoScreen.dart';
import 'package:software_analista/ui/viewmodels/lista_utentiViewmodel.dart';
import 'package:software_analista/ui/widgets/UtenteCard.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/domain/models/utente.dart';

class SelezioneUtenteScreen extends StatefulWidget {
  const SelezioneUtenteScreen({super.key});

  @override
  State<SelezioneUtenteScreen> createState() => _SelezioneUtenteScreenState();
}

class _SelezioneUtenteScreenState extends State<SelezioneUtenteScreen> {
  Utente? utenteSelezionato;
  String ricerca = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Row(
        children: [
          Sidebar(),
          Expanded(
            child: Column(
              children: [
                TopBar(),
                
                // Contenitore centrato con larghezza massima 600
                Expanded(
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 600),
                      child: Column(
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                            child: Text(
                              "Seleziona Utente",
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ),
                          // Barra di Ricerca
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: TextField(
                              decoration: const InputDecoration(
                                hintText: 'Cerca utente...',
                                prefixIcon: Icon(Icons.search),
                                border: OutlineInputBorder(),
                              ),
                              onChanged: (val) {
                                setState(() {
                                  ricerca = val.toLowerCase();
                                });
                              },
                            ),
                          ),

                          // Lista Utenti
                          Expanded(
                            child: Consumer<lista_utentiViewmodel>(
                              builder: (context, vm, _) {
                                if (vm.isLoading) {
                                  return const Center(child: CircularProgressIndicator());
                                }

                                final listaFiltrata = vm.utenti.where((u) {
                                  final nome = u.nome.toLowerCase();
                                  final cognome = u.cognome.toLowerCase();
                                  return nome.contains(ricerca) || cognome.contains(ricerca);
                                }).toList();

                                if (listaFiltrata.isEmpty) {
                                  return const Center(child: Text("Nessun utente trovato."));
                                }

                                return ListView.separated(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  itemCount: listaFiltrata.length,
                                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                                  itemBuilder: (context, index) {
                                    final utente = listaFiltrata[index];
                                    final isSelected = utenteSelezionato == utente;
                                    
                                    return Opacity(
                                      opacity: isSelected ? 1.0 : 0.8,
                                      child: Container(
                                        decoration: isSelected 
                                            ? BoxDecoration(border: Border.all(color: Colors.black, width: 2), borderRadius: BorderRadius.circular(16))
                                            : null,
                                        child: UtenteCard(
                                          utente: utente,
                                          onTap: () {
                                            setState(() {
                                              utenteSelezionato = utente;
                                            });
                                          },
                                        ),
                                      ),
                                    );
                                  },
                                );
                              },
                            ),
                          ),

                          // Bottone Continua
                          Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Center(
                              child: SizedBox(
                                width: 300,
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.black,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                onPressed: utenteSelezionato != null
                                    ? () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => SelezionePercorsoScreen(
                                              utenteSelezionato: utenteSelezionato!,
                                            ),
                                          ),
                                        );
                                      }
                                    : null,
                                child: const Text(
                                  'Continua',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
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
  }
}