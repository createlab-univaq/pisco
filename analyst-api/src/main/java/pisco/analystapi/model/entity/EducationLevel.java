package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Lookup table for the "Titoli di Studio" of spec section 2.4. The set is fixed, so the
 * code is the primary key -- a surrogate id would buy nothing and force a join to read
 * a patient's level.
 */
@Entity
@Table(name = "education_levels")
@Getter
@Setter
@NoArgsConstructor
public class EducationLevel {

    @Id
    @Column(length = 40)
    private String code;

    /** What the dropdown shows, with the casing and accents the code cannot carry. */
    @Column(nullable = false, length = 100)
    private String label;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    public EducationLevel(String code, String label, int sortOrder) {
        this.code = code;
        this.label = label;
        this.sortOrder = sortOrder;
    }
}
