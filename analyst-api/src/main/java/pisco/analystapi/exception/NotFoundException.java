package pisco.analystapi.exception;

/**
 * Also thrown when a record exists but belongs to another analyst. Answering 404 rather
 * than 403 keeps the API from confirming that an id someone guessed is real.
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public static NotFoundException of(String entity, Object id) {
        return new NotFoundException("%s %s non trovato".formatted(entity, id));
    }
}
