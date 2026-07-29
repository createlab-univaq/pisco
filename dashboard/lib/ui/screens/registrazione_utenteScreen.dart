import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:software_analista/data/repository/registrazione_utentiRepository.dart';
import 'package:software_analista/data/service/registrazione_utentiService.dart';
import 'package:software_analista/domain/enums/extensions_scuola.dart';
import 'package:software_analista/domain/enums/extensions_titoloStudio.dart';
import 'package:software_analista/domain/enums/scuola.dart';
import 'package:software_analista/domain/enums/titoloStudio.dart';
import 'package:software_analista/domain/models/utente.dart';
import 'package:software_analista/ui/viewmodels/registrazioneUtente_Viewmodel.dart';
import 'package:software_analista/domain/enums/sesso.dart';
import 'package:software_analista/ui/widgets/Sidebar.dart';
import 'package:software_analista/ui/widgets/Topbar.dart';
import 'package:flutter/services.dart';

class RegistrazioneUtenteScreen extends StatelessWidget {
  const RegistrazioneUtenteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => Registrazioneutente_Viewmodel(
        repository: RegistrazioneUtenteRepository(
          service: RegistrazioneUtenteService(),
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Row(
          children: [
            Sidebar(),

            Expanded(
              child: Column(
                children: [
                  TopBar(),

                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    child: Text(
                      "Registrazione nuovo utente",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),

                  Expanded(
                    child: Theme(
                      data: Theme.of(context).copyWith(
                        inputDecorationTheme: InputDecorationTheme(
                          filled: true,
                          fillColor: Colors.white,
                          labelStyle:
                              const TextStyle(color: Colors.black),
                          contentPadding:
                              const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          border: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Colors.black,
                              width: 1.5,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Colors.black,
                              width: 1.5,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius:
                                BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Colors.black,
                              width: 2,
                            ),
                          ),
                        ),
                        elevatedButtonTheme:
                            ElevatedButtonThemeData(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black,
                            foregroundColor: Colors.white,
                            padding:
                                const EdgeInsets.symmetric(
                                    vertical: 14),
                            textStyle: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                            shape:
                                RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: Center(
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(
                              maxWidth: 520, // 👈 larghezza form
                            ),
                            child: Consumer<
                                Registrazioneutente_Viewmodel>(
                              builder: (context, vm, _) {
                                return Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: [
                                    TextField(
                                      decoration:
                                          const InputDecoration(
                                        labelText: 'Nome',
                                      ),
                                      onChanged:
                                          vm.updateNome,
                                    ),
                                    const SizedBox(height: 12),

                                    TextField(
                                      decoration:
                                          const InputDecoration(
                                        labelText: 'Cognome',
                                      ),
                                      onChanged:
                                          vm.updateCognome,
                                    ),
                                    const SizedBox(height: 12),

                                    DropdownButtonFormField<
                                        Sesso>(
                                      decoration:
                                          const InputDecoration(
                                        labelText: 'Sesso',
                                      ),
                                      value: vm.sesso,
                                      items: Sesso.values
                                          .map((s) {
                                        return DropdownMenuItem(
                                          value: s,
                                          child:
                                              Text(s.name),
                                        );
                                      }).toList(),
                                      onChanged:
                                          vm.updateSesso,
                                    ),
                                    const SizedBox(height: 24),

                                    InkWell(
                                      onTap: () async {
                                        final pickedDate =
                                            await showDatePicker(
                                          context: context,
                                          initialDate:
                                              vm.dataNascita ??
                                                  DateTime.now(),
                                          firstDate:
                                              DateTime(2000),
                                          lastDate:
                                              DateTime.now(),
                                        );

                                        if (pickedDate !=
                                            null) {
                                          vm.updateDataNascita(
                                              pickedDate);
                                        }
                                      },
                                      child: InputDecorator(
                                        decoration:
                                            const InputDecoration(
                                          labelText:
                                              'Data di nascita',
                                        ),
                                        child: Text(
                                          vm.dataNascita !=
                                                  null
                                              ? '${vm.dataNascita!.day}/${vm.dataNascita!.month}/${vm.dataNascita!.year}'
                                              : 'Seleziona una data',
                                          style: TextStyle(
                                            color: vm.dataNascita !=
                                                    null
                                                ? Colors.black
                                                : Colors.grey,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 12),

                                    TextField(
                                      decoration:
                                          const InputDecoration(
                                        labelText: 'Email',
                                      ),
                                      onChanged:
                                          vm.updateEmail,
                                    ),
                                    const SizedBox(height: 12),

                                    TextField(
                                      decoration:
                                          const InputDecoration(
                                        labelText:
                                            'Numero di telefono',
                                      ),
                                      onChanged:
                                          vm.updateTelefono,
                                    ),
                                    const SizedBox(height: 12),

                                    DropdownButtonFormField<
                                        Scuole>(
                                      decoration:
                                          const InputDecoration(
                                        labelText:
                                            'Scuola frequentata',
                                      ),
                                      value:
                                          vm.scuolaFrequentata,
                                      items: Scuole.values
                                          .map((sc) {
                                        return DropdownMenuItem(
                                          value: sc,
                                          child:
                                              Text(sc.label),
                                        );
                                      }).toList(),
                                      onChanged:
                                          vm.updateScuola,
                                    ),
                                    const SizedBox(height: 24),

                                    DropdownButtonFormField<
                                        TitoloStudio>(
                                      decoration:
                                          const InputDecoration(
                                        labelText:
                                            'Titolo di studio',
                                      ),
                                      value:
                                          vm.titoloStudio,
                                      items: TitoloStudio
                                          .values
                                          .map((t) {
                                        return DropdownMenuItem(
                                          value: t,
                                          child:
                                              Text(t.label),
                                        );
                                      }).toList(),
                                      onChanged:
                                          vm.updateTitolo,
                                    ),
                                    const SizedBox(height: 24),

                                    if (vm.errorMessage !=
                                        null)
                                      Padding(
                                        padding:
                                            const EdgeInsets
                                                .only(
                                                bottom: 12),
                                        child: Text(
                                          vm.errorMessage!,
                                          style:
                                              const TextStyle(
                                                  color:
                                                      Colors
                                                          .red),
                                        ),
                                      ),

                                    ElevatedButton(
                                      onPressed: () async {
                                        final nuovoUtente =
                                            await vm
                                                .registraUtente();
                                        if (nuovoUtente !=
                                            null) {
                                          final utenteDaRitornare =
                                              await _showSuccessDialog(
                                                  context,
                                                  nuovoUtente);
                                          Navigator.pop(
                                              context,
                                              utenteDaRitornare);
                                        }
                                      },
                                      child: const Text(
                                          'Registra'),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<Utente?> _showSuccessDialog(
      BuildContext context, Utente utente) {
    return showDialog<Utente>(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        title:
            const Text('Registrazione completata 🎉'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            const Text('Codice gioco:'),
            const SizedBox(height: 8),
            SelectableText(
              utente.codiceGioco!,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton.icon(
            onPressed: () {
              Clipboard.setData(
                ClipboardData(
                    text: utente.codiceGioco!),
              );
              ScaffoldMessenger.of(context)
                  .showSnackBar(
                const SnackBar(
                    content: Text(
                        'Codice copiato negli appunti')),
              );
            },
            icon: const Icon(Icons.copy),
            label: const Text('Copia Codice'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context,
                      rootNavigator: true)
                  .pop(utente);
            },
            child: const Text('Chiudi'),
          ),
        ],
      ),
    );
  }
}
