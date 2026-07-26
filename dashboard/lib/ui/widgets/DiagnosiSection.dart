import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/domain/models/diagnosi.dart';
import 'package:software_analista/ui/viewmodels/dashboard_utenteViewmodel.dart';
import 'package:software_analista/ui/widgets/DialogDiagnosi.dart';
import 'package:software_analista/utils/formatDate.dart';

class DiagnosiSection extends StatelessWidget {
  const DiagnosiSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<DashboardUtenteViewModel>(
      builder: (context, vm, _) {
        final diagnosi = vm.utente.diagnosi;

        /// 🔴 CASO 1: NESSUNA DIAGNOSI
        if (diagnosi == null) {
          return Center(
            child: ElevatedButton.icon(
              icon: const Icon(Icons.add),
              label: const Text("Inserisci Diagnosi"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
              ),
              onPressed: () async {
                final nuovaDiagnosi = await showDialog<Diagnosi>(
                  context: context,
                  builder: (_) => DiagnosiDialog(),
                );

                if (nuovaDiagnosi != null) {
                  await vm.inserisciDiagnosi(nuovaDiagnosi);
                }
              },
            ),
          );
        }

        /// 🟢 CASO 2: DIAGNOSI PRESENTE
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Center(
                child: Text(
                  "Diagnosi",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),

              const SizedBox(height: 16),

              Text(diagnosi.testo, style: const TextStyle(fontSize: 16)),

              const SizedBox(height: 16),

              Row(
                children: [
                  const Text(
                    "Gravità: ",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(diagnosi.livelloGravita.name),
                ],
              ),

              /// NOTE (condizionale)
              if (diagnosi.note != null && diagnosi.note!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Note: ",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Expanded(child: Text(diagnosi.note!)),
                    ],
                  ),
                ),

              const SizedBox(height: 12),

              Text(
                "Inserita il: ${FormatDate(diagnosi.dataInserimento)}",
                style: const TextStyle(fontSize: 12),
              ),

              const SizedBox(height: 20),

              /// BOTTONI
              Row(
                children: [
                  /// ✏️ MODIFICA
                  ElevatedButton.icon(
                    icon: const Icon(Icons.edit),
                    label: const Text("Modifica"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () async {
                      final modificata = await showDialog<Diagnosi>(
                        context: context,
                        builder: (_) => DiagnosiDialog(diagnosi: diagnosi),
                      );

                      if (modificata != null) {
                        await vm.modificaDiagnosi(modificata);
                      }
                    },
                  ),

                  const SizedBox(width: 12),

                  /// 🗑 ELIMINA
                  ElevatedButton.icon(
                    icon: const Icon(Icons.delete),
                    label: const Text("Elimina"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () async {
                      final conferma = await showDialog<bool>(
                        context: context,
                        builder:
                            (_) => AlertDialog(
                              title: const Text("Conferma eliminazione"),
                              content: const Text(
                                "Sei sicuro di voler eliminare la diagnosi?",
                              ),
                              actions: [
                                TextButton(
                                  onPressed:
                                      () => Navigator.pop(context, false),
                                  child: const Text("Annulla"),
                                ),
                                TextButton(
                                  onPressed: () => Navigator.pop(context, true),
                                  child: const Text("Elimina"),
                                ),
                              ],
                            ),
                      );

                      if (conferma == true) {
                        await vm.eliminaDiagnosi();
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
