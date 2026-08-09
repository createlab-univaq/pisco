package pisco.analystapi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Opens a run. The spec lists an endpoint that posts nodes to an {@code execution_id} but
 * none that produces one, so this is the missing half.
 */
@Getter
@Setter
@NoArgsConstructor
public class StartExecutionDTO {

    @NotBlank
    @Size(max = 12)
    private String uniqueCode;
}
