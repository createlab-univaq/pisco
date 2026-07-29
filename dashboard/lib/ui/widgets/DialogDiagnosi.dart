import 'package:flutter/material.dart';
import 'package:software_analista/domain/enums/livelloGravita.dart';
import 'package:software_analista/domain/models/diagnosi.dart';

class DiagnosiDialog extends StatefulWidget {
  final Diagnosi? diagnosi;

  const DiagnosiDialog({super.key, this.diagnosi});

  @override
  State<DiagnosiDialog> createState() => _DiagnosiDialogState();
}

class _DiagnosiDialogState extends State<DiagnosiDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _testoController;
  late TextEditingController _noteController;
  LivelloGravita? _livelloSelezionato;

  @override
  void initState() {
    super.initState();
    _testoController = TextEditingController(text: widget.diagnosi?.testo ?? "");
    _noteController = TextEditingController(text: widget.diagnosi?.note ?? "");
    _livelloSelezionato = widget.diagnosi?.livelloGravita;
  }

  @override
  void dispose() {
    _testoController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Container(
        width: 500, // Larghezza fissa per coerenza
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.diagnosi == null ? "Nuova Diagnosi" : "Modifica Diagnosi",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _testoController,
                decoration: const InputDecoration(
                  labelText: "Testo Diagnosi",
                  border: OutlineInputBorder(),
                ),
                maxLines: 4,
                validator: (val) => val == null || val.isEmpty ? "Campo obbligatorio" : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<LivelloGravita>(
                value: _livelloSelezionato,
                decoration: const InputDecoration(
                  labelText: "Livello Gravità",
                  border: OutlineInputBorder(),
                ),
                items: LivelloGravita.values
                    .map((e) => DropdownMenuItem(value: e, child: Text(e.name)))
                    .toList(),
                onChanged: (val) => setState(() => _livelloSelezionato = val),
                validator: (val) => val == null ? "Seleziona un livello" : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _noteController,
                decoration: const InputDecoration(
                  labelText: "Note aggiuntive (opzionale)",
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Annulla", style: TextStyle(color: Colors.black)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    ),
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        final nuova = Diagnosi(
                          testo: _testoController.text,
                          livelloGravita: _livelloSelezionato!,
                          note: _noteController.text.isEmpty ? null : _noteController.text,
                          dataInserimento: widget.diagnosi?.dataInserimento ?? DateTime.now(),
                        );
                        Navigator.pop(context, nuova);
                      }
                    },
                    child: const Text("Salva", style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
