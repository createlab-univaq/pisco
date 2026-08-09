package pisco.analystapi.common;

public final class LogUtils {

    private static final int VISIBLE_PREFIX = 4;

    private LogUtils() {}

    /**
     * A unique code is the only credential guarding the unauthenticated endpoints, so
     * writing one to a log file is writing a password to a log file. Enough of the prefix
     * survives to correlate lines with a session; the rest does not.
     */
    public static String maskCode(String code) {
        if (code == null || code.isBlank()) {
            return "<vuoto>";
        }
        if (code.length() <= VISIBLE_PREFIX) {
            return "*".repeat(code.length());
        }
        return code.substring(0, VISIBLE_PREFIX) + "*".repeat(code.length() - VISIBLE_PREFIX);
    }
}
