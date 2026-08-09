package pisco.analystapi.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pisco.analystapi.common.Constants;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * The dashboard requests the catalogue on every path-assignment screen. A minute of
     * staleness is invisible to the analyst and spares Polyglot the repeated load.
     */
    @Bean
    public CaffeineCacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(Constants.Caches.POLYGLOT_CATALOG);
        manager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofSeconds(60))
                .maximumSize(64));
        return manager;
    }
}
