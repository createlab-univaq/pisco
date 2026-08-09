package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatientPathDTO {

    /** The association's own id -- what DELETE takes, not the Polyglot flow id. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID patientId;

    /** The only piece of the Polyglot path stored locally (spec section 3). */
    @NotBlank
    @Size(max = 64)
    private String polyglotPathId;

    /** Generated on assignment; the analyst hands it to the patient. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String uniqueCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant assignedAt;
}
