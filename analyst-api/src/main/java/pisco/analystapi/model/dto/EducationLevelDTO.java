package pisco.analystapi.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Read-only lookup: the rows are seeded, never created through the API. */
@Getter
@Setter
@NoArgsConstructor
public class EducationLevelDTO {

    private String code;

    private String label;
}
