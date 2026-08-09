package pisco.analystapi.model.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * What the patient's client receives after redeeming a unique code: enough to identify
 * the session, plus the full Polyglot path fetched live. Nothing clinical, since this
 * endpoint is reachable without logging in.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResolvedPathDTO {

    private String uniqueCode;

    private UUID patientPathId;

    private UUID patientId;

    private String polyglotPathId;

    /** Passed through verbatim from Polyglot -- this service does not model its shape. */
    private Object path;
}
