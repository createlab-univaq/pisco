package pisco.analystapi.exception;

/** A uniqueness or state rule was violated: duplicate email, path already assigned. */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
