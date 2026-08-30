package pisco.analystapi.model.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * What the patient's client receives after redeeming a unique code: enough to identify
 * the session, plus the flow it refers to. Nothing clinical and nothing anagraphic, since
 * this endpoint is reachable without logging in.
 *
 * <p>The flow comes back without its graph, like everywhere outside the flow detail
 * endpoint.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResolvedPathDTO {

    private String uniqueCode;

    private UUID patientPathId;

    private UUID patientId;

    private FlowDTO flow;
}
