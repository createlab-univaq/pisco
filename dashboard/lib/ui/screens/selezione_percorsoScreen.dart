import 'package:flutter/material.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/domain/models/percorso.dart';
import 'package:software_analista/ui/screens/riassunto_assegnazioneScreen.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/ui/viewmodels/lista_percorsiViewmodel.dart';
import 'package:software_analista/ui/widgets/percorso_card.dart';

class SelezionePercorsoScreen extends StatefulWidget {
  final Utente utenteSelezionato;
  const SelezionePercorsoScreen({super.key, required this.utenteSelezionato});

  @override
  State<SelezionePercorsoScreen> createState() => _SelezionePercorsoScreenState();
}

class _SelezionePercorsoScreenState extends State<SelezionePercorsoScreen> {
  Percorso? percorsoSelezionato;
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
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Titolo della pagina
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                            child: Text(
                              "Seleziona percorso",
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ),

                          // Barra di Ricerca
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: TextField(
                              decoration: const InputDecoration(
                                hintText: 'Cerca percorso...',
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

                          const SizedBox(height: 16),

                          // Lista Percorsi
                          Expanded(
                            child: Consumer<lista_percorsiViewModel>(
                              builder: (context, vm, _) {
                                final listaFiltrata = vm.percorsi.where((p) {
                                  return p.title.toLowerCase().contains(ricerca);
                                }).toList();

                                if (listaFiltrata.isEmpty) {
                                  return const Center(child: Text("Nessun percorso trovato."));
                                }

                                return ListView.separated(
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                                  itemCount: listaFiltrata.length,
                                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                                  itemBuilder: (context, index) {
                                    final percorso = listaFiltrata[index];
                                    final isSelected = percorsoSelezionato == percorso;

                                    return Opacity(
                                      opacity: isSelected ? 1.0 : 0.8,
                                      child: Container(
                                        decoration: isSelected 
                                            ? BoxDecoration(border: Border.all(color: Colors.black, width: 2), borderRadius: BorderRadius.circular(16))
                                            : null,
                                        child: PercorsoCard(
                                          percorso: percorso,
                                          onTap: () {
                                            setState(() {
                                              percorsoSelezionato = percorso;
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
                                  onPressed: percorsoSelezionato != null
                                      ? () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => AssegnazioneRiassuntoScreen(
                                              utente: widget.utenteSelezionato,
                                              percorso: percorsoSelezionato!,
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