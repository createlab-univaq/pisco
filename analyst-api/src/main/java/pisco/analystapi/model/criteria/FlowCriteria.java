package pisco.analystapi.model.criteria;

import lombok.*;
import org.springframework.data.jpa.domain.Specification;
import pisco.analystapi.model.entity.Flow;
import pisco.analystapi.model.repository.specifications.FlowSpecifications;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlowCriteria extends BaseCriteria implements Serializable {

    private String search;

    private Boolean published;


    @Override
    protected String defaultOrderBy() {
        return "name";
    }

    public Specification<Flow> toSpecification() {
        Specification<Flow> specification = Specification.unrestricted();
        if(!Objects.isNull(search) && !search.isBlank()) {
            specification = specification.and(FlowSpecifications.matching(search));
        }
        if(!Objects.isNull(published)) {
            specification = specification.and(FlowSpecifications.published(published));
        }
        return specification;
    }

    public static Specification<Flow> getSpecification(FlowCriteria criteria) {
        return Objects.isNull(criteria) ? Specification.unrestricted() : criteria.toSpecification();
    }

}
