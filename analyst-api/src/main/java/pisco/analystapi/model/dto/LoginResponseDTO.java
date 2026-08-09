package pisco.analystapi.model.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;

    /** Lets the dashboard schedule a re-login instead of discovering the 401 mid-action. */
    private Instant expiresAt;

    private AnalystDTO analyst;
}
