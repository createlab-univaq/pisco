# game-api — API reference

Backend for the **analyst dashboard** (`/dashboard`) and the **Godot game client**.

- Base URL: `http://<host>:3000` — the port is hardcoded at `index.js:35` and the app does **not** read a `PORT` variable.
- All request and response bodies are JSON, except the Excel export (binary `.xlsx`).
- CORS currently reflects any origin with `credentials: true` (`index.js:14-21`).

## Authentication

Analyst endpoints expect a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain it from `POST /auth/login`. The payload is `{ id, email }` where `id` is the
analyst's `_id`; lifetime comes from `JWT_EXPIRES_IN` (`auth.controller.js:85-92`).

Any failure in `middleware/authMiddleware.js` returns **401**:

| Condition | Body |
|---|---|
| Header missing or not `Bearer …` | `{ "message": "Token mancante o formato non valido" }` |
| Token invalid or expired | `{ "message": "Token non valido o scaduto" }` |

Endpoints marked **public** below have no such check — see [Security notes](#security-notes).

Protected endpoints are also **scoped to the calling analyst**: every query filters on
`analistaId: req.user.id`, so one analyst can never read or modify another's records.

---

## Auth

### POST `/auth/register` — public

Registers an analyst.

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "dataNascita": "1990-05-14",
  "email": "mario.rossi@example.com",
  "password": "plaintext-password"
}
```

All five fields are required. The password is bcrypt-hashed with 10 rounds before storage.

| Status | Body |
|---|---|
| 201 | `{ "message": "Registrazione completata con successo" }` |
| 400 | `{ "message": "Tutti i campi sono obbligatori" }` or `{ "message": "Email già registrata" }` |
| 500 | `{ "message": "Errore interno del server", "error": "…" }` |

Note: no token is returned — call `/auth/login` next.

### POST `/auth/login` — public

```json
{ "email": "mario.rossi@example.com", "password": "plaintext-password" }
```

| Status | Body |
|---|---|
| 200 | `{ "message": "Login effettuato", "token": "eyJhbGciOi…" }` |
| 400 | `{ "message": "Email e password obbligatorie" }` |
| 401 | `{ "message": "Utente non trovato" }` or `{ "message": "Email e/o Password errate" }` |
| 500 | `{ "message": "Errore server", "error": "…" }` |

---

## Health

### GET `/api/health` — public

| Status | Body |
|---|---|
| 200 | `{ "status": "ok" }` |

Suitable as a container/Coolify healthcheck target.

---

## Utenti (patients)

### POST `/utente` — auth

Creates a patient owned by the calling analyst. `codiceGioco` is generated
server-side (6 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` — no `O`, `0`,
`I`, `1` — retried until unique) and `analistaId` is taken from the token.

```json
{
  "nome": "Luca",
  "cognome": "Bianchi",
  "dataNascita": "2008-03-22",
  "sesso": "maschio",
  "email": "optional@example.com",
  "numTelefono": "3331234567",
  "scuolaFrequentata": "Scuola_secondaria_di_secondo_grado",
  "titoloStudio": "Diploma_di_terza_media"
}
```

`email` and `numTelefono` are optional; everything else is required by the schema.
See [Enums](#enums) for the allowed values.

| Status | Body |
|---|---|
| 201 | `{ "nuovoUtente": { …Utente } }` (note the wrapper key) |
| 400 | `{ "error": "<mongoose validation message>" }` |

### GET `/utente` — auth

Lists every patient belonging to the calling analyst.

| Status | Body |
|---|---|
| 200 | `[ { …Utente }, … ]` (bare array, not wrapped) |
| 500 | `{ "error": "…" }` |

### POST `/utenti/delete` — auth

Bulk delete. **Also cascades**: all `TentativoTest` documents of the deleted
patients are removed first (`utente.controller.js:301-303`).

```json
{ "userIds": ["652f…a1", "652f…b2"] }
```

| Status | Body |
|---|---|
| 200 | `{ "message": "Utenti e tentativi eliminati con successo", "deletedCount": 2 }` |
| 400 | `{ "message": "Lista userIds non valida" }` (missing, not an array, or empty) |
| 403 | `{ "message": "Non puoi eliminare utenti che non appartengono al tuo account" }` |
| 500 | `{ "message": "Errore server durante eliminazione" }` |

The 403 is all-or-nothing: if *any* id is not owned by the caller, nothing is deleted.

### GET `/utente/:codiceGioco` — **public**

Used by the game to load avatar/inventory state. Returns only these fields.

| Status | Body |
|---|---|
| 200 | `{ "_id": "…", "tipoAvatar": 3, "lookAttuale": {…}, "inventario": {…}, "moneteNotifier": 120 }` |
| 404 | `{ "error": "Codice gioco non valido" }` |

---

## Percorsi (assigned learning paths)

### POST `/utenti/:id/assegna-percorso` — auth

`:id` is the patient's Mongo `_id`.

```json
{ "percorsoIdEsterno": "flow-abc-123", "nomePercorso": "Riconoscimento emozioni" }
```

| Status | Body |
|---|---|
| 200 | `{ "utente": { …Utente } }` — assigned |
| 200 | `{ "message": "Percorso già assegnato" }` — duplicate, **also 200** |
| 400 | `{ "message": "Dati percorso mancanti" }` |
| 404 | `{ "message": "Utente non trovato" }` |
| 500 | `{ "message": "Errore server" }` |

Both success and no-op return 200 with *different shapes* — check for the `utente` key
rather than the status code.

### GET `/utenti/:codiceGioco/percorsi` — **public**

| Status | Body |
|---|---|
| 200 | `[ { "percorsoIdEsterno": "flow-abc-123", "nomePercorso": "…", "assegnatoIl": "2026-07-26T…", "ctxId": null, "Livello_Attuale": 0, "Completato": false } ]` |
| 404 | `{ "message": "Utente non trovato" }` |

### DELETE `/utenti/:id/percorsi/:percorsoIdEsterno` — auth

| Status | Body |
|---|---|
| 200 | `{ "message": "Percorso rimosso con successo", "percorsiAssegnati": [ … ] }` |
| 404 | `{ "message": "Utente non trovato" }` |

Removing a path that was never assigned still returns 200 (the `$pull` is a no-op).

### PATCH `/utenti/:codiceGioco/progressi` — **public**

Called by the game to persist progress. Every field is optional, but `percorsoId`
is required in practice: it selects which entry of `percorsiAssegnati` to update,
and the query matches on it.

```json
{
  "percorsoId": "flow-abc-123",
  "Livello_Attuale": 4,
  "Completato": false,
  "tipoAvatar": 2,
  "moneteNotifier": 150,
  "lookAttuale": { "cappello": "rosso" },
  "inventario": { "cappelli": ["rosso", "blu"] }
}
```

Type checks are strict (`typeof === "number"` / `"boolean"` / `"object"`), so
`"4"` as a string is silently ignored.

| Status | Body |
|---|---|
| 200 | `{ …Utente }` (full updated document) |
| 400 | `{ "message": "Nessun campo valido da aggiornare" }` |
| 404 | `{ "message": "Utente non trovato" }` — also returned when `percorsoId` matches no assigned path |
| 500 | `{ "message": "Errore server" }` |

### PATCH `/utenti/:codiceGioco/ctx` — **public**

Stores the Polyglot execution context id against an assigned path.

```json
{ "percorsoId": "flow-abc-123", "ctxId": "ctx-987" }
```

| Status | Body |
|---|---|
| 200 | `{ "message": "ctxId aggiornato correttamente" }` |
| 400 | `{ "message": "percorsoId e ctxId sono obbligatori" }` |
| 404 | `{ "message": "Utente o percorso non trovato" }` |

---

## Diagnosi

### PUT `/utenti/:id/diagnosi` — auth

Creates or replaces the patient's single diagnosis (it is an embedded object, not a list).

```json
{ "testo": "Descrizione della diagnosi", "livelloGravita": "Livello_2", "note": "optional" }
```

`testo` and `livelloGravita` are required; `note` defaults to `null`.
`dataInserimento` is set server-side.

| Status | Body |
|---|---|
| 200 | `{ …Utente }` (with the new `diagnosi`) |
| 400 | `{ "message": "Campi obbligatori mancanti" }` |
| 404 | `{ "message": "Utente non trovato" }` |
| 500 | `{ "message": "…" }` |

### DELETE `/utenti/:id/diagnosi` — auth

| Status | Body |
|---|---|
| 200 | `{ …Utente }` (with `diagnosi` unset) |
| 404 | `{ "message": "Utente non trovato" }` |

---

## Tentativi test (test attempts)

### POST `/api/tentativi-test` — **public**

Submitted by the game after a test. The patient is resolved from `codiceGioco`,
which is *not* stored on the attempt — `utenteId` is.

```json
{
  "codiceGioco": "A7K2QM",
  "testId": "eyes-task-1",
  "nomeTest": "Eyes Task",
  "tipoTest": "pre",
  "percorsoId": "flow-abc-123",
  "superato": true,
  "tempoMedioReazione": 1234.5,
  "movimentoMouse": 87,
  "domande": [
    { "indice": 0, "correct": true, "reactionTime": 980 },
    { "indice": 1, "correct": false, "reactionTime": 1490 }
  ]
}
```

Every field except `codiceGioco` is required by the schema. `tipoTest` must be
`pre` or `post`. Each entry of `domande` requires `indice`, `correct`, `reactionTime`.

| Status | Body |
|---|---|
| 201 | `{ …TentativoTest }` |
| 404 | `{ "error": "Codice gioco non valido" }` |
| 500 | `{ "error": "<validation message>" }` — note: validation errors surface as **500**, not 400 |

### GET `/api/tentativi-test/tentativi/:codiceGioco` — auth

All attempts for one patient. The patient must belong to the calling analyst.

| Status | Body |
|---|---|
| 200 | `[ { …TentativoTest }, … ]` |
| 404 | `{ "message": "Utente non trovato" }` |
| 500 | `{ "message": "Errore del server" }` |

### GET `/api/tentativi-test/tutti` — auth

Every attempt across all of the calling analyst's patients.

| Status | Body |
|---|---|
| 200 | `[ { …TentativoTest }, … ]` |
| 500 | `{ "message": "Errore server" }` |

---

## Export

### GET `/export/excel/:utenteId` — auth

Generates an `.xlsx` report for one patient (pre/post attempts split into separate
sections, age computed from `dataNascita`).

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="report_<nome>.xlsx"`

| Status | Body |
|---|---|
| 200 | binary `.xlsx` stream |
| 404 | `{ "message": "Utente non trovato" }` |
| 500 | `{ "message": "Errore export Excel" }` |

Treat the response as a blob, not JSON.

---

## Models

### Utente

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `nome`, `cognome` | string | required |
| `dataNascita` | Date | required |
| `sesso` | enum | required |
| `codiceGioco` | string | unique, indexed, **immutable**, server-generated |
| `email`, `numTelefono` | string | optional |
| `scuolaFrequentata`, `titoloStudio` | enum | required |
| `analistaId` | ObjectId → Analista | required, from the JWT |
| `diagnosi` | object \| null | embedded, single; default `null` |
| `percorsiAssegnati` | array | see below |
| `tipoAvatar` | number \| null | game state |
| `lookAttuale` | map<string,string> | game state |
| `inventario` | map<string,string[]> | game state |
| `moneteNotifier` | number | default `0` |
| `createdAt`, `updatedAt` | Date | timestamps |

`percorsiAssegnati[]`: `percorsoIdEsterno` (required), `nomePercorso` (required),
`assegnatoIl` (default now), `ctxId` (default `null`), `Livello_Attuale` (default `0`),
`Completato` (default `false`).

`diagnosi`: `testo` (required), `livelloGravita` (enum, required), `note`
(default `null`), `dataInserimento` (immutable, default now).

### TentativoTest

`utenteId` (ObjectId → Utente, indexed), `testId`, `nomeTest`, `tipoTest`
(`pre`|`post`), `percorsoId`, `superato` (bool), `tempoMedioReazione` (number),
`movimentoMouse` (number), `domande[]` (`indice`, `correct`, `reactionTime`),
`createdAt`, `updatedAt`. All required.

### Analista

`nome`, `cognome`, `dataNascita`, `email` (unique, lowercased), `password`
(bcrypt hash), `createdAt`, `updatedAt`. The password hash is **not** stripped
from responses anywhere, but no endpoint currently returns an Analista document.

### Enums

| Field | Values |
|---|---|
| `sesso` | `maschio`, `femmina` |
| `scuolaFrequentata` | `Scuola_secondaria_di_primo_grado`, `Scuola_secondaria_di_secondo_grado`, `Universita`, `Non_frequento`, `Altro` |
| `titoloStudio` | `Diploma_di_terza_media`, `Diploma_di_scuola_superiore`, `Laurea_di_I_livello`, `Laurea_di_II_livello`, `Master_dottorato_specializzazione` |
| `livelloGravita` | `Livello_1`, `Livello_2`, `Livello_3` |
| `tipoTest` | `pre`, `post` |

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | yes | `config/db.js` calls `process.exit(1)` if the connection fails |
| `JWT_SECRET` | yes | signs and verifies tokens; unset ⇒ login 500s and every protected route 401s |
| `JWT_EXPIRES_IN` | recommended | e.g. `1h`. If unset, `expiresIn` is `undefined` and **tokens never expire** |

There is no `PORT` variable: the server always listens on **3000**.

---

## Security notes

**Five endpoints are unauthenticated** because the Godot client has no login:

- `GET /utente/:codiceGioco`
- `GET /utenti/:codiceGioco/percorsi`
- `PATCH /utenti/:codiceGioco/progressi`
- `PATCH /utenti/:codiceGioco/ctx`
- `POST /api/tentativi-test`

The 6-character `codiceGioco` is therefore the only credential protecting a
patient's game data. The keyspace is 32⁶ ≈ 1.07 × 10⁹ with no rate limiting, so
enumeration is feasible; and because `PATCH …/progressi` accepts arbitrary
`inventario` and `moneteNotifier` values, a client can grant itself unlimited
in-game currency. Acceptable for a game client, worth knowing before this handles
real patient data.

**CORS is fully open** — `index.js:16-20` reflects any `Origin` and sets
`credentials: true`, with the project's own `TODO: check domain cors in production
env`. Since auth uses a header rather than cookies, the practical exposure is
limited, but this should become an allowlist before public deployment.
