package pisco.analystapi.model.dto.validation;

/**
 * A single DTO serves both create and update, but the rules differ -- a password is
 * required to register and optional when editing. These groups let one class express both.
 */
public final class ValidationGroups {

    private ValidationGroups() {}

    public interface Create {}

    public interface Update {}
}
