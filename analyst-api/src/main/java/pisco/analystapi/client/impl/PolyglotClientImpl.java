package pisco.analystapi.client.impl;

import java.net.http.HttpClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import pisco.analystapi.client.PolyglotClient;
import pisco.analystapi.common.Constants;
import pisco.analystapi.config.PolyglotProperties;
import pisco.analystapi.exception.UpstreamException;

/**
 * Talks to the Polyglot backend over its service-to-service routes, authenticated with a
 * shared secret in the {@code x-service-token} header.
 *
 * <p>RestClient rather than WebClient: this is a servlet stack, so WebClient would mean
 * blocking on the result anyway, paying for a Reactor scheduler hop to get there. With
 * virtual threads enabled a blocking call parks a virtual thread and costs nothing.
 */
@Component
@Slf4j
public class PolyglotClientImpl implements PolyglotClient {

    /** Header the Polyglot backend's checkServiceToken middleware reads. */
    private static final String SERVICE_TOKEN_HEADER = "x-service-token";

    /** Server-to-server route for the flow catalogue. */
    private static final String CATALOG_PATH = "/api/flows/catalog";

    /**
     * Server-to-server route for one flow.
     *
     * <p>This does not exist on the Polyglot backend yet: flow-by-id is guarded by Google
     * auth there, not by the service token. It needs a PR adding
     * {@code GET /api/flows/catalog/:id} with checkServiceToken, mounted above
     * {@code /:id} or that route swallows it. Until then fetchPath answers 502.
     */
    private static final String FLOW_PATH = "/api/flows/catalog/%s";

    private final PolyglotProperties properties;
    private final RestClient restClient;

    public PolyglotClientImpl(PolyglotProperties properties) {
        this.properties = properties;
        this.restClient = isConfigured(properties) ? build(properties) : null;
        if (this.restClient == null) {
            log.warn("Integrazione Polyglot non configurata: gli endpoint sui percorsi "
                    + "risponderanno 503 finche' base-url e service-token non sono impostati");
        }
    }

    @Override
    @Cacheable(Constants.Caches.POLYGLOT_CATALOG)
    public Object fetchCatalog() {
        return get(CATALOG_PATH);
    }

    @Override
    public Object fetchPath(String polyglotPathId) {
        return get(FLOW_PATH.formatted(polyglotPathId));
    }

    private Object get(String path) {
        RestClient client = require();
        try {
            return client.get().uri(path).retrieve().body(Object.class);
        } catch (RestClientResponseException ex) {
            log.error("Polyglot ha risposto {} per {}", ex.getStatusCode().value(), path);
            throw new UpstreamException.Failed(
                    "Polyglot ha risposto %d".formatted(ex.getStatusCode().value()), ex);
        } catch (ResourceAccessException ex) {
            log.error("Polyglot non raggiungibile su {}{}", properties.baseUrl(), path, ex);
            throw new UpstreamException.Failed("Polyglot non raggiungibile", ex);
        }
    }

    private RestClient require() {
        if (restClient == null) {
            throw new UpstreamException.NotConfigured(
                    "Integrazione Polyglot non configurata (POLYGLOT_API_URL / POLYGLOT_SERVICE_TOKEN)");
        }
        return restClient;
    }

    private static boolean isConfigured(PolyglotProperties properties) {
        return StringUtils.hasText(properties.baseUrl()) && StringUtils.hasText(properties.serviceToken());
    }

    private static RestClient build(PolyglotProperties properties) {
        // java.net.http.HttpClient pools connections and reuses TLS sessions. The default
        // SimpleClientHttpRequestFactory would open a fresh connection per call.
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder()
                        .connectTimeout(properties.connectTimeout())
                        .build());
        // Without a read timeout a hung Polyglot would hold this service's threads open.
        factory.setReadTimeout(properties.readTimeout());

        return RestClient.builder()
                .baseUrl(properties.baseUrl())
                .requestFactory(factory)
                .defaultHeader(SERVICE_TOKEN_HEADER, properties.serviceToken())
                .build();
    }
}
