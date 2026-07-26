import 'package:flutter/material.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';

class TestTable extends StatelessWidget {
  final List<Test> tests;
  final String titolo;

  const TestTable({super.key, required this.tests, required this.titolo});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: MediaQuery.of(context).size.width,
        ),
        child: DataTable(
          headingRowColor: MaterialStateColor.resolveWith(
            (states) => Colors.black,
          ),
          headingTextStyle: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          columnSpacing: 20,
          dividerThickness: 1,

          columns: [
            DataColumn(label: Text(titolo)),
            DataColumn(label: Text("Risultato")),
            DataColumn(label: Text("Tempo medio di reazione")),
            DataColumn(label: Text("Movimento del mouse")),
          ],

          rows:
              tests.map((test) {
                return DataRow(
                  cells: [
                    DataCell(
                      Text(
                        test.nomeTest,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    DataCell(
                      Text("${test.domandeCorrette} / ${test.totaleDomande}"),
                    ),
                    DataCell(
                      Text("${test.tempoMedioReazione.toStringAsFixed(2)} ms"),
                    ),
                    DataCell(Text('${test.movimentoMouse}')),
                  ],
                );
              }).toList(),

          border: TableBorder.symmetric(
            inside: const BorderSide(color: Colors.black, width: 1),
            outside: const BorderSide(color: Colors.black, width: 1),
          ),
        ),
      ),
    );
  }
}
