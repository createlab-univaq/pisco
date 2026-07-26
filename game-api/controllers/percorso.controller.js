const POLYGLOT_API_URL = process.env.POLYGLOT_API_URL;
const POLYGLOT_SERVICE_TOKEN = process.env.POLYGLOT_SERVICE_TOKEN;

/**
 * GET /percorsi
 *
 * The flow catalogue lives in the Polyglot backend, not here -- we only store
 * references to it (percorsoIdEsterno). The dashboard cannot call that backend
 * from the browser: it is a different origin (CORS) and it authenticates with
 * Google ID tokens, which the analyst login does not produce.
 *
 * So we fetch it server-side with a shared service token and hand the result
 * back under this API's own analyst JWT.
 */
exports.listaPercorsi = async (req, res) => {
  if (!POLYGLOT_API_URL || !POLYGLOT_SERVICE_TOKEN) {
    return res.status(500).json({
      message:
        "Integrazione Polyglot non configurata (POLYGLOT_API_URL / POLYGLOT_SERVICE_TOKEN)",
    });
  }

  try {
    const response = await fetch(`${POLYGLOT_API_URL}/api/flows/catalog`, {
      headers: { "x-service-token": POLYGLOT_SERVICE_TOKEN },
    });

    if (!response.ok) {
      return res.status(502).json({
        message: "Errore dal servizio Polyglot",
        status: response.status,
      });
    }

    return res.status(200).json(await response.json());
  } catch (error) {
    console.error("Errore nel recupero dei percorsi:", error);
    return res.status(502).json({
      message: "Servizio Polyglot non raggiungibile",
    });
  }
};
