package pisco.analystapi.exception;

/** A payload the caller can fix: malformed base64, an unsupported image type, too large. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
