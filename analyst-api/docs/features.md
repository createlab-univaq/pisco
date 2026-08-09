# Documento di Specifica dei Requisiti: Dashboard Analista

Il presente documento descrive le funzionalità, le regole di business e i requisiti tecnici per lo sviluppo del modulo "Dashboard Analista" e le relative integrazioni.

---

## 1. Autenticazione e Regole di Accesso
* **Analista:** L'accesso al sistema richiede l'autenticazione obbligatoria (Login/Logout).
* **Paziente:** Il paziente **non** necessita di alcuna autenticazione per le interazioni previste dal sistema.

---

## 2. Modello Dati e Gestione Entità (Operazioni CRUD)

### 2.1 Entità: Analista (Analysts)
Gestione del profilo del professionista che utilizza la piattaforma.
* **Funzionalità:** Creazione, Lettura, Modifica, Cancellazione (CRUD).
* **Campi Dati:**
  * `ID` (Primary Key)
  * `Name` (String)
  * `Surname` (String)
  * `Email` (String - univoca)
  * `HashedPassword` (String - credenziali sicure)
  * `CreatedAt` (Timestamp)
  * `UpdatedAt` (Timestamp)
* **Relazioni:** Un analista può avere **più** pazienti associati (Relazione Molti-a-Molti, gestita tramite la tabella pivot `AnalystPatient`).

### 2.2 Entità: Paziente (Patients)
Gestione dell'anagrafica dei pazienti da parte dell'analista.
* **Funzionalità:** Creazione, Lettura, Modifica, Cancellazione (CRUD).
* **Campi Dati:**
  * `ID` (Primary Key)
  * `Name` (String)
  * `Surname` (String)
  * `Sex` (String/Enum)
  * `Birthday` (Date - sostituisce il campo età calcolato)
  * `CreatedAt` (Timestamp)
  * `UpdatedAt` (Timestamp)
  * `DegreeID` (Foreign Key - riferimento alla tabella "Degree")
* **Relazioni:** Un paziente può essere associato a uno o più analisti tramite la tabella `AnalystPatient`.

### 2.3 Entità: Associazione Analista-Paziente (AnalystPatient)
Tabella di giunzione fondamentale che regola le assegnazioni all'interno del sistema.
* **Campi Dati:**
  * `AnalystPatientID` (Primary Key)
  * `PatientID` (Foreign Key)
  * `AnalystID` (Foreign Key)

### 2.4 Entità: Diagnosi (Diagnosis)
Storico e gestione delle diagnosi associate a uno specifico incarico.
* **Funzionalità:** Creazione, Lettura, Modifica, Cancellazione (CRUD).
* **Campi Dati:**
  * `ID` (Primary Key)
  * `Text` (Text/Long String)
  * `Date` (Date/Datetime)
  * `Notes` (Text)
  * `Drugs` (Text - campo testuale libero)
  * `CreatedAt` (Timestamp)
  * `UpdatedAt` (Timestamp)
  * `AnalystPatientID` (Foreign Key)
* **Relazioni:** Ogni diagnosi è strettamente legata alla relazione `AnalystPatient` (garantendo che la diagnosi appartenga al paziente *e* all'analista che lo ha in cura).

### 2.5 Tabella Anagrafica: Titoli di Studio (Degree)
Tabella di appoggio per standardizzare i livelli di istruzione.
* **Campi Dati:** `ID`, `Title`.
* **Uso tecnico:** Utilizzata per popolare i menu a tendina e collegare in modo strutturato il dato al profilo del Paziente (tramite `DegreeID`).

---

## 3. Integrazione Percorsi (Sistema Polyglot)
La piattaforma prevede l'associazione tra un Paziente (seguito da un Analista) e uno o più percorsi terapeutici/formativi gestiti dal sistema esterno "Polyglot".

* **Entità Relativa (AnalystPatientPaths):**
  * `PathCode` (Primary Key - Codice univoco generato)
  * `PolyglotPathID` (String/Integer - ID fornito da Polyglot)
  * `AnalystPatientID` (Foreign Key - Lega il percorso all'assegnazione paziente/analista)
* **Flusso di Associazione:** 
  * Un analista può associare uno o più "percorsi" a un paziente.
  * Il database locale **non** replica i dati del percorso, ma salva esclusivamente l'ID di Polyglot (`PolyglotPathID`).
* **Codice Univoco (`PathCode`):** Per ogni associazione creata, il sistema utilizza questo codice per identificare in modo univoco il path.
* **Endpoint Richiesto (API Esterna/App):** Deve essere sviluppato un endpoint specifico che, ricevendo in input il `PathCode`, effettui il fetch e restituisca i dati completi del percorso Polyglot associato.

---

## 4. Tracciamento Dati: Esecuzione Gioco (Analytics)
Il sistema deve prevedere endpoint dedicati all'inserimento (scrittura) dei dati di telemetria durante l'esecuzione dei giochi/test. I dati sono strutturati in due tabelle principali:

### 4.1 Entità: Esecuzione Gioco (GameExecution)
Traccia le singole sessioni di gioco avviate.
* **Campi Dati:**
  * `ID` (Primary Key)
  * `Date` (Datetime)
  * `PathCode` (Foreign Key - collega l'esecuzione al percorso del paziente)

### 4.2 Entità: Risposte/Nodi (GameAnswer)
Traccia i dati di telemetria per ogni singolo **Nodo** attraversato.
* **Campi Dati:**
  * `ID` (Primary Key)
  * `ReactionTime` (Float/Integer - tempo di reazione)
  * `PatientScore` (Float/Integer - punteggio ottenuto)
  * `MaxScore` (Float/Integer - punteggio massimo ottenibile)
  * `MouseDistance` (Integer - misurata in pixel)
  * `PatientGameExecutionNodeNumber` (Integer - numero di sequenza dell'esecuzione)
  * `NodeTypeID` (Foreign Key - collega alla tabella anagrafica `NodeType` per indicare il tipo di nodo)
  * `GameExecutionID` (Foreign Key - collega la risposta alla sessione genitore)

---

## 5. Elenco degli Endpoint API Necessari (Architettura REST)

Di seguito la lista degli endpoint per l'implementazione Backend. Le rotte sono indicative e seguono le best practice RESTful.

### Autenticazione
* `POST /api/auth/login` - Autenticazione dell'analista e rilascio token.
* `POST /api/auth/logout` - Disconnessione dell'analista.

### CRUD Analista
* `GET /api/analysts` - Recupera la lista degli analisti.
* `GET /api/analysts/{id}` - Recupera i dettagli di un singolo analista.
* `POST /api/analysts` - Crea un nuovo analista.
* `PUT /api/analysts/{id}` - Modifica i dati di un analista.
* `DELETE /api/analysts/{id}` - Elimina un analista.

### CRUD Paziente (Attraverso AnalystPatient)
* `GET /api/patients` - Recupera la lista dei pazienti associati all'analista loggato.
* `GET /api/patients/{id}` - Recupera i dettagli di un singolo paziente.
* `POST /api/patients` - Crea un nuovo paziente (associandolo all'analista loggato creando un record in `AnalystPatient`).
* `PUT /api/patients/{id}` - Modifica l'anagrafica di un paziente.
* `DELETE /api/patients/{id}` - Elimina un paziente (e le relative associazioni in `AnalystPatient`).

### CRUD Diagnosi
* `GET /api/analyst-patients/{analyst_patient_id}/diagnoses` - Recupera lo storico delle diagnosi per la specifica associazione Analista-Paziente.
* `GET /api/diagnoses/{id}` - Recupera il dettaglio di una singola diagnosi.
* `POST /api/analyst-patients/{analyst_patient_id}/diagnoses` - Inserisce una nuova diagnosi.
* `PUT /api/diagnoses/{id}` - Modifica una diagnosi esistente.
* `DELETE /api/diagnoses/{id}` - Elimina una diagnosi.

### Anagrafiche di Base
* `GET /api/degrees` - Recupera la lista dei titoli di studio (`Degree`).
* `GET /api/node-types` - Recupera la lista dei tipi di nodi del gioco (`NodeType`).

### Integrazione Polyglot & Percorsi
* `GET /api/polyglot-paths` - Proxy per recuperare la lista dei percorsi da Polyglot.
* `POST /api/analyst-patients/{analyst_patient_id}/paths` - Associa un percorso Polyglot. Restituisce il `PathCode` generato.
* `GET /api/analyst-patients/{analyst_patient_id}/paths` - Recupera tutti i percorsi associati.
* `DELETE /api/paths/{path_code}` - Rimuove l'associazione di un percorso (`AnalystPatientPaths`).
* `GET /api/paths/resolve/{path_code}` - Recupera l'ID interno, interroga le API Polyglot e restituisce il percorso completo.

### Tracciamento ed Esecuzione Gioco (Analytics)
* `GET /api/game-executions` - Recupera lo storico delle esecuzioni (GameExecution).
* `GET /api/game-executions/{id}` - Recupera i dettagli dell'esecuzione, includendo la lista dei nodi (`GameAnswer`).
* `GET /api/game-executions/by-path/{path_code}` - Recupera le esecuzioni relative allo specifico `PathCode`.
* `POST /api/game-executions/{execution_id}/answers` - Salva le metriche (ReactionTime, PatientScore, MaxScore, ecc.) nella tabella `GameAnswer` per il relativo nodo attraversato.