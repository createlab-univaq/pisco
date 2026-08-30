package pisco.analystapi.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    /** Referenced by both the components map and the global requirement below. */
    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI analystDashboardOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Analyst Dashboard API")
                        .version("v1")
                        .description("""
                                Gestione analisti, pazienti, diagnosi, flow e telemetria \
                                di gioco.

                                Autenticazione: POST /api/auth/login restituisce un JWT. \
                                Incollarlo in Authorize (senza il prefisso "Bearer").

                                Alcuni endpoint sono volutamente pubblici perche' il client \
                                del paziente non effettua login: la risoluzione di un codice \
                                univoco e la scrittura della telemetria."""))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT emesso da POST /api/auth/login")))
                .servers(List.of(new Server().url("/")))
                // Applied to every operation. The public ones ignore it rather than
                // rejecting it, so a single Authorize covers the whole document.
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME));
    }
}
