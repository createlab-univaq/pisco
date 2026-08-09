package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import pisco.analystapi.model.dto.DegreeDTO;
import pisco.analystapi.model.entity.Degree;

/**
 * The rows are seeded and exposed read-only, so nothing calls updateEntity here -- it is
 * inherited for uniformity, not because the API can write a lookup value.
 */
@Mapper
public interface DegreeMapper extends BaseMapper<Degree, DegreeDTO> {}
