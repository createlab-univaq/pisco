package pisco.analystapi.model.mapper;

import java.util.List;
import org.mapstruct.MappingTarget;

/**
 * Shared shape for every mapper. MapStruct resolves {@code E} and {@code D} from the
 * concrete interface's type arguments and generates all three methods, so a mapper only
 * declares the mappings that differ from convention.
 *
 * <p>{@code updateEntity} writes in place rather than returning a new entity: that keeps
 * the instance attached to the persistence context, so an edit is a dirty check rather
 * than a merge. Creating works the same way -- {@code new Entity()} followed by
 * {@code updateEntity} -- which is why there is no separate toEntity.
 *
 * @param <E> entity type
 * @param <D> DTO type
 */
public interface BaseMapper<E, D> {

    D toDto(E entity);

    List<D> toDto(List<E> entities);

    void updateEntity(@MappingTarget E entity, D dto);
}
