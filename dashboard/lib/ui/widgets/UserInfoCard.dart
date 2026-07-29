import 'package:flutter/material.dart';
import 'package:software_analista/domain/enums/extensions_scuola.dart';
import 'package:software_analista/domain/enums/extensions_titoloStudio.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/ui/widgets/InfoItem.dart';
import 'package:software_analista/ui/widgets/codiceutenteRow.dart';
import 'package:software_analista/utils/formatDate.dart';
import 'package:software_analista/utils/formatSesso.dart';

class UserInfoCard extends StatelessWidget {
  final Utente utente;
  final bool gestionePercorsiMode;
  final Function(String percorsoId) onRemovePercorso;

  const UserInfoCard({
    super.key,
    required this.utente,
    required this.gestionePercorsiMode,
    required this.onRemovePercorso,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 2),
        borderRadius: BorderRadius.circular(12),
        color: Colors.white,
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Dati utente",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              InfoItem(
                label: "Data di nascita",
                value: FormatDate(utente.dataDiNascita),
              ),
              InfoItem(label: "Sesso", value: FormatSesso(utente.sesso)),
            ],
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              InfoItem(
                label: "Scuola Frequentata",
                value: utente.scuolaFrequentata.label,
              ),
              InfoItem(
                label: "Titolo di studio",
                value: utente.titoloStudio.label,
              ),
            ],
          ),

          const SizedBox(height: 12),

          CodiceUtenteRow(codice: utente.codiceGioco),

          const SizedBox(height: 20),

          /// NUOVA SEZIONE PERCORSI ASSEGNATI
          const Text(
            "Percorsi assegnati:",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 10),

          if (utente.percorsiAssegnati.isEmpty)
            const Text(
              "Nessun percorso assegnato",
              style: TextStyle(color: Colors.grey),
            )
          else
            ...utente.percorsiAssegnati.map(
              (percorso) => Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        percorso.nomePercorso,
                        style: const TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ),
                    if (gestionePercorsiMode)
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.red),
                        onPressed: () {
                          onRemovePercorso(percorso.percorsoIdEsterno);
                        },
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
