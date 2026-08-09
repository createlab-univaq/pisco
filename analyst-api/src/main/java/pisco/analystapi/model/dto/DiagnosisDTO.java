package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiagnosisDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    /** Taken from the URL on write, echoed back on read. Never trusted from the body. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID patientId;

    /** When the diagnosis was made, which is not when it was typed in. */
    @NotNull
    private Instant diagnosisDate;

    @NotBlank
    private String diagnosisText;

    private String notes;

    /** Free text by explicit request (spec section 2.3), deliberately not a relation. */
    private String medications;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;
}
