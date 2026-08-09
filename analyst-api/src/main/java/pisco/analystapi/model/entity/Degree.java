package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Lookup table for the "Titoli di Studio" of spec section 2.5. The set is fixed, so the
 * code is the primary key -- a surrogate id would buy nothing and force a join to read
 * a patient's degree.
 */
@Entity
@Table(name = "degrees")
@Getter
@Setter
@NoArgsConstructor
public class Degree {

    @Id
    @Column(length = 40)
    private String code;

    /** What the dropdown shows, with the casing and accents the code cannot carry. */
    @Column(nullable = false, length = 100)
    private String label;

    /**
     * Rank of the qualification, 1 being the lowest. It is what the dropdown orders by,
     * so the list reads by level of education rather than alphabetically.
     */
    @Column(name = "education_level", nullable = false)
    private int educationLevel;

    public Degree(String code, String label, int educationLevel) {
        this.code = code;
        this.label = label;
        this.educationLevel = educationLevel;
    }
}
