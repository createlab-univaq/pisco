package pisco.analystapi.common;

/**
 * Values shared across layers, or fixed by a protocol rather than by us. Anything
 * deployment-dependent belongs in configuration instead -- the issuer, the token
 * lifetime and the Polyglot routes all live in application.yaml for that reason.
 */
public final class Constants {

    private Constants() {}

    /** Claim names in the tokens this service issues and verifies. */
    public static final class JwtClaims {

        private JwtClaims() {}

        public static final String EMAIL = "email";
        public static final String ROLE = "role";
    }

    public static final class Security {

        private Security() {}

        /** Spring Security's convention: authorities are the role name with this prefix. */
        public static final String ROLE_PREFIX = "ROLE_";
        public static final String ROLE_ADMIN = ROLE_PREFIX + "ADMIN";
    }

    public static final class Caches {

        private Caches() {}

        public static final String POLYGLOT_CATALOG = "polyglotCatalog";
    }
}
