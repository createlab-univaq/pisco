package pisco.analystapi.exception;

/**
 * A call to Polyglot failed. The two subtypes map to different status codes on purpose:
 * "we are not configured" and "they are down" need entirely different fixes, and
 * collapsing both into a 500 is what makes an integration hard to debug.
 */
public abstract class UpstreamException extends RuntimeException {

    protected UpstreamException(String message) {
        super(message);
    }

    protected UpstreamException(String message, Throwable cause) {
        super(message, cause);
    }

    /** Polyglot is unreachable, timed out, or answered with an error status. -&gt; 502 */
    public static class Failed extends UpstreamException {
        public Failed(String message) {
            super(message);
        }

        public Failed(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /** This service has no base URL or service token configured. -&gt; 503 */
    public static class NotConfigured extends UpstreamException {
        public NotConfigured(String message) {
            super(message);
        }
    }
}
