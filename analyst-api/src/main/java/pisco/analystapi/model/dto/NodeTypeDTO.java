package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Lookup of game node types (spec section 4.2). */
@Getter
@Setter
@NoArgsConstructor
public class NodeTypeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    /**
     * The only field read on the way in. Telemetry knows Polyglot's type string, not the
     * id this service assigned to it, so a write names the type and the server resolves it.
     */
    @NotBlank
    @Size(max = 100)
    private String label;
}
