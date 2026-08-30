package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pisco.analystapi.model.dto.validation.ValidationGroups.Create;
import pisco.analystapi.model.dto.validation.ValidationGroups.Update;

/**
 * Serves two jobs, which is why the constraints are grouped. Writing a flow validates the
 * Create or Update group, where the name is required and the id is ignored. Referencing
 * one -- nested in PatientPathDTO to say which flow to assign -- validates the default
 * group, where only the id matters.
 */
@Getter
@Setter
@NoArgsConstructor
public class FlowDTO {

    /**
     * Deliberately not READ_ONLY: that would exclude it from deserialization, and an
     * assignment names its flow by id. Dictating it on create is harmless because
     * FlowMapper.updateEntity ignores it -- the mapper is the guard, not the annotation.
     */
    @NotNull
    private UUID id;

    @NotBlank(groups = Create.class)
    @Size(max = 200, groups = {Create.class, Update.class})
    private String name;

    @Size(max = 1000, groups = {Create.class, Update.class})
    private String description;

    private Boolean published;

    /**
     * The React Flow graph. Only populated by the detail endpoint: lists and every place
     * a flow appears nested would otherwise carry an entire graph per row.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Map<String, Object> flowJson;

    /** The author. Assigned from the token on create, never taken from the payload. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private AnalystDTO analyst;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;

    /** Moves on every edit, so the editor can tell a stale copy from a current one. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant updatedAt;
}
