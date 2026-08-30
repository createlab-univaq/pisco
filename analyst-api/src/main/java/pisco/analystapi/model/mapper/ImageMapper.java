package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.ImageDTO;
import pisco.analystapi.model.entity.Image;

/** Metadata only: the bytes travel through the download endpoint, not through a DTO. */
@Mapper
public interface ImageMapper extends BaseMapper<Image, ImageDTO> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "data", ignore = true)
    @Mapping(target = "contentType", ignore = true)
    @Mapping(target = "sizeBytes", ignore = true)
    void updateEntity(@MappingTarget Image image, ImageDTO dto);
}
