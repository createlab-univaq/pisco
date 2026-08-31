# Game Flow
**Lato Dashboard**
* l'analista assegna un path a un utente, così facendo si genera un codice con cui si possono fare più run di un flow.

**Lato Gioco**
* l'analista apre il gioco ed effettua il login
* il paziente inserisce il codice del flow e parte la run

# Cosa succede al termine di una run?
Al termine di una run il gioco chiama l'endpoint per le game-executions e invia questo json
```json
{
    "runName": "", // timestamp
    "flowCode": "",
    "nodes": [ // singoli nodi del path
        {
            "nodeId": "",
            "nodeName": "",
            "nodeType": "",
            "isExercise": true, // te lo passo io, true se è un nodo esercitazione
            "maxScore": 0,
            "score": 0,
            "percentageScore": 0,
            "averageReactionTimeInMilliseconds": 0, // da quando esce la domanda al primo input
            "averageResponseTimeInMilliseconds": 0, // dal primo input a quando submitta la risposta
            "averageMouseDistanceInCentimeters": 0, // totale durante tutta la domanda
            "answers": [
                {
                    "reactionTime": 0,
                    "responseTime": 0,
                    "mouseDistance": 0,
                    "azzeccata": true // te lo passo io, non sapevo come chiamarla brother sorry, è true se utente ha risposto correttamente
                }
            ]
        }
    ]
}
```

Lì dove:
* l'intero json rappresenta una run
* "runName" è il timestamp di quando è stata inviata la run, può essere generata dal backend (questo è l'unico valore che ti chiedo di generare, il resto te lo passo io)
* "flowCode" è il codice del flow dell'associazione paziente-flow
* "nodes" sono i singoli nodi che ha 'percorso' l'utente durante la run, ogni nodo ha più di una domanda dunque è per questo che presenta valori medi
* "isExercise" dice se un nodo è un esercitazione oppure no (mi serve lato frontend)
* "answers" sono le risposte alle singole domande del nodo
* il nodo "container" che ti dicevo primo verrà inteso come un singolo nodo semplice in cui si aggregano tutti i nodi esercitazione al suo interno, nulla di preoccupante, per te lato backend sarà un nodo come gli altri