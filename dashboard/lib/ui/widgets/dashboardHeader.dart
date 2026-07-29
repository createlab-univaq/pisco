import 'package:flutter/material.dart';

class DashboardHeader extends StatelessWidget {
  final String nome;
  final String cognome;

  const DashboardHeader({
    super.key,
    required this.nome,
    required this.cognome,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      "$nome $cognome",
      style: const TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}