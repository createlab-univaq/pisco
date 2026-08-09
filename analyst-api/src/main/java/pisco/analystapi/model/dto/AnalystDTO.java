package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pisco.analystapi.model.dto.validation.ValidationGroups.Create;
import pisco.analystapi.model.dto.validation.ValidationGroups.Update;
import pisco.analystapi.model.entity.Role;

@Getter
@Setter
@NoArgsConstructor
public class AnalystDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotBlank(groups = {Create.class, Update.class})
    @Size(max = 100)
    private String firstName;

    @NotBlank(groups = {Create.class, Update.class})
    @Size(max = 100)
    private String lastName;

    @NotBlank(groups = {Create.class, Update.class})
    @Email
    @Size(max = 255)
    private String email;

    /**
     * Accepted on the way in, never serialized on the way out -- the response for a
     * freshly created analyst must not echo the password back.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(groups = Create.class)
    @Size(min = 8, max = 72, groups = {Create.class, Update.class})
    private String password;

    /** Assigned server-side. A client cannot make itself an admin by sending this. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Role role;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;
}
