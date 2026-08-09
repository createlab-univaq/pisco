package pisco.analystapi.client;

public interface PolyglotClient {

    /** The full flow catalogue, as Polyglot returns it. Passed through untouched. */
    Object fetchCatalog();

    /** One flow with its nodes and edges. */
    Object fetchPath(String polyglotPathId);
}
