package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pisco.analystapi.model.entity.Gender;

/**
 * No analyst field in either direction: who follows this patient comes from the token, so
 * a client can neither file a patient under someone else's name nor learn who else is in
 * the system.
 */
@Getter
@Setter
@NoArgsConstructor
public class PatientDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotNull
    private Gender gender;

    /** A snapshot, not a derived value: the spec asks for an age, not a birth date. */
    @NotNull
    @Min(0)
    @Max(120)
    private Integer age;

    /**
     * Optional. Only the code is read on the way in -- the rest of the lookup is filled
     * from the database, so a client cannot invent a label for a code it does not own.
     */
    private DegreeDTO degree;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;
}
