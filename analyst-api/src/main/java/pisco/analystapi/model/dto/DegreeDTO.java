package pisco.analystapi.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Read-only lookup: the rows are seeded, never created through the API. */
@Getter
@Setter
@NoArgsConstructor
public class DegreeDTO {

    private String code;

    private String label;

    /**
     * The rank, 1 being the lowest. The list already arrives ordered by it, so this is
     * for clients that re-sort or group on their own rather than for reading in sequence.
     */
    private int educationLevel;
}
