import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:software_analista/domain/enums/sesso.dart';
import 'package:software_analista/domain/models/utente.dart';

class UtenteCard extends StatelessWidget {
  final Utente utente;
  final VoidCallback? onTap;
  final bool isSelected;
  final bool selectionMode;
  final VoidCallback? onSelect;

  const UtenteCard({
    super.key,
    required this.utente,
    this.onTap,
    this.isSelected = false,
    this.selectionMode = false,
    this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.black, width: 1.5),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        splashColor: Colors.black.withOpacity(0.08),
        hoverColor: Colors.black.withOpacity(0.04),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              if (selectionMode)
                Checkbox(value: isSelected, onChanged: (_) => onSelect?.call()),

              if (selectionMode) const SizedBox(width: 8),

              /// ICONA UTENTE
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color:
                      utente.sesso == Sesso.maschio
                          ? Colors.blue.shade400
                          : Colors.pink.shade400,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  utente.sesso == Sesso.maschio ? Icons.male : Icons.female,
                  size: 24,
                  color: Colors.white,
                ),
              ),

              const SizedBox(width: 16),

              /// INFO
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "${utente.nome} ${utente.cognome}",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "Età: ${_calcolaEta(utente.dataDiNascita)} anni",
                      style: const TextStyle(
                        fontSize: 13,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),

              /// CHEVRON
              const Icon(Icons.chevron_right, size: 26, color: Colors.black54),
            ],
          ),
        ),
      ),
    );
  }

  int _calcolaEta(DateTime dataNascita) {
    final now = DateTime.now();
    int anni = now.year - dataNascita.year;
    if (now.month < dataNascita.month ||
        (now.month == dataNascita.month && now.day < dataNascita.day)) {
      anni--;
    }
    return anni;
  }
}
