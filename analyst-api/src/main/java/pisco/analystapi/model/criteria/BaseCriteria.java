package pisco.analystapi.model.criteria;

import lombok.Data;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

@Data
public abstract class BaseCriteria {

    protected Sort.Direction sort = Sort.Direction.ASC;

    protected String orderBy;

    /** The property to sort by when the caller names none. */
    protected abstract String defaultOrderBy();

    /**
     * Built here rather than at the call site because both fields are optional query
     * parameters: Sort.Order rejects a null direction and asserts the property has text,
     * so an absent orderBy has to become a real column before it reaches Sort.by.
     */
    public Sort toSort() {
        return Sort.by(
                sort == null ? Sort.Direction.ASC : sort,
                StringUtils.hasText(orderBy) ? orderBy : defaultOrderBy());
    }
}
