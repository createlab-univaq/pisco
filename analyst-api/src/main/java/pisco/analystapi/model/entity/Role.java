package pisco.analystapi.model.entity;

public enum Role {
    /** Manages only their own patients and everything hanging off them. */
    ANALYST,
    /** Additionally manages the analyst registry (spec section 5, "riservato agli admin"). */
    ADMIN
}
