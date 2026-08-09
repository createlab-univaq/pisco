package pisco.analystapi.service.impl;

import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import pisco.analystapi.common.Constants;
import pisco.analystapi.config.AppProperties;
import pisco.analystapi.config.security.JwtConfig;
import pisco.analystapi.service.JwtService;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtEncoder encoder;
    private final AppProperties properties;

    @Override
    public IssuedToken issue(UUID analystId, String email, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(properties.jwt().expiresIn());

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(properties.jwt().issuer())
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(analystId.toString())
                .claim(Constants.JwtClaims.EMAIL, email)
                .claim(Constants.JwtClaims.ROLE, role)
                .build();

        // JwtConfig.ALGORITHM is the single source of truth: the decoder is built with the
        // same constant, and signing with anything else fails verification at the filter.
        String value = encoder
                .encode(JwtEncoderParameters.from(JwsHeader.with(JwtConfig.ALGORITHM).build(), claims))
                .getTokenValue();

        return new IssuedToken(value, expiresAt);
    }
}
