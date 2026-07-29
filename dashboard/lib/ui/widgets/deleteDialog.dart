import 'package:flutter/material.dart';

class DeleteDialog extends StatelessWidget {
  const DeleteDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Conferma eliminazione"),
      content: const Text(
        "Sei sicuro di voler eliminare gli utenti selezionati e i dati relativi ai test da loro svolti?\n\nQuesta azione è irreversibile.",
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Annulla"),
        ),
        TextButton(
          onPressed: () {
            Navigator.pop(context, true);
          },
          child: const Text("Elimina", style: TextStyle(color: Colors.red)),
        ),
      ],
    );
  }
}
