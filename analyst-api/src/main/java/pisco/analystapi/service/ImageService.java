package pisco.analystapi.service;

import java.util.UUID;
import pisco.analystapi.model.dto.ImageDTO;
import pisco.analystapi.model.entity.Image;

public interface ImageService {

    /** {@code mimeType} may be null, in which case it is read from the bytes. */
    ImageDTO create(String base64, String mimeType);

    ImageDTO replace(UUID id, String base64, String mimeType);

    /** The bytes, for the public download. */
    Image requireById(UUID id);

    void delete(UUID id);
}
