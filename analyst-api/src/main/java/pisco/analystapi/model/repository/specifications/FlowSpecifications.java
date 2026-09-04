package pisco.analystapi.model.repository.specifications;

import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import pisco.analystapi.model.entity.Analyst;
import pisco.analystapi.model.entity.Flow;

/**
 * Criteria fragments for the flow list. Built through the CriteriaBuilder rather than
 * written as JPQL: the search term is bound as a typed String parameter, where a
 * hand-written {@code :search is null} left Postgres nothing to infer from and it settled
 * on bytea.
 */
public final class FlowSpecifications {

    private FlowSpecifications() {}

    /** A flow is private to its author, so this is on every list read, never optional. */
    public static Specification<Flow> ownedBy(UUID analystId) {
        return (root, query, builder) -> builder.equal(root.get("analyst").get("id"), analystId);
    }

    public static Specification<Flow> published(boolean published) {
        return ((root, query, builder) -> builder.equal(root.get("published"), published));
    }

    /**
     * Case-insensitive contains over name and description. A blank term is not a filter
     * that matches everything but no filter at all, so it returns the unrestricted
     * specification and leaves the ownership clause standing alone.
     */
    public static Specification<Flow> matching(String search) {
        if (!StringUtils.hasText(search)) {
            return Specification.unrestricted();
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, builder) -> builder.or(
                builder.like(builder.lower(root.get("name")), pattern),
                // description is nullable: lower(null) like ... is unknown, never true, so
                // a flow without one simply fails this half of the or.
                builder.like(builder.lower(root.get("description")), pattern));
    }
}
