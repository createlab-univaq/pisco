package pisco.analystapi.service.impl;

import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.config.AppProperties;
import pisco.analystapi.exception.BadRequestException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.ImageDTO;
import pisco.analystapi.model.entity.Image;
import pisco.analystapi.model.mapper.ImageMapper;
import pisco.analystapi.model.repository.ImageRepository;
import pisco.analystapi.service.ImageService;

/**
 * The type is taken from what the caller declares -- the mimeType field, or the header of
 * a data URL -- and never guessed from the bytes. What actually stops a content-type
 * confusion is the nosniff header on the download, not an inspection here.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ImageServiceImpl implements ImageService {

    private static final String DATA_URL_PREFIX = "data:";

    private static final String SVG = "image/svg+xml";

    private static final String IMAGE_PREFIX = "image/";

    private final ImageRepository repository;
    private final ImageMapper mapper;
    private final AppProperties properties;

    @Override
    @Transactional
    public ImageDTO create(String base64, String mimeType) {
        Image image = new Image();
        apply(image, base64, mimeType);

        Image saved = repository.saveAndFlush(image);
        log.info("Immagine caricata id={} tipo={} byte={}",
                saved.getId(), saved.getContentType(), saved.getSizeBytes());
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public ImageDTO replace(UUID id, String base64, String mimeType) {
        Image image = requireById(id);
        apply(image, base64, mimeType);

        log.info("Immagine sostituita id={} tipo={} byte={}",
                id, image.getContentType(), image.getSizeBytes());
        return mapper.toDto(image);
    }

    @Override
    @Transactional(readOnly = true)
    public Image requireById(UUID id) {
        return repository.findById(id).orElseThrow(() -> {
            log.info("Immagine {} non trovata", id);
            return NotFoundException.of("Immagine", id);
        });
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Nothing checks whether a flow still references it: flowJson is opaque here, so
        // the graph can point at an image that has been removed and gets a 404 for it.
        repository.delete(requireById(id));
        log.info("Immagine eliminata id={}", id);
    }

    /**
     * Splits a data URL when there is one, so {@code data:image/png;base64,iVBOR...} needs
     * no separate mimeType. An explicit mimeType still wins: it is the deliberate answer,
     * where the prefix is whatever the browser happened to attach.
     */
    private void apply(Image image, String base64, String mimeType) {
        String encoded = base64.trim();
        String declared = mimeType;

        if (encoded.startsWith(DATA_URL_PREFIX)) {
            int comma = encoded.indexOf(',');
            if (comma < 0) {
                throw new BadRequestException("Data URL malformato: manca la virgola");
            }
            if (!StringUtils.hasText(declared)) {
                // "data:image/png;base64" -> "image/png"
                String header = encoded.substring(DATA_URL_PREFIX.length(), comma);
                int semicolon = header.indexOf(';');
                declared = semicolon < 0 ? header : header.substring(0, semicolon);
            }
            encoded = encoded.substring(comma + 1);
        }

        byte[] data = decode(encoded);
        image.setData(data);
        image.setContentType(normalizeContentType(declared));
        image.setSizeBytes(data.length);
    }

    private byte[] decode(String encoded) {
        // Line breaks are legal in MIME base64 and common in hand-built payloads.
        String clean = encoded.replaceAll("\\s", "");

        byte[] data;
        try {
            data = Base64.getDecoder().decode(clean);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Immagine non decodificabile: base64 non valido");
        }
        if (data.length == 0) {
            throw new BadRequestException("Immagine vuota");
        }

        long maxBytes = properties.images().maxSize().toBytes();
        if (data.length > maxBytes) {
            throw new BadRequestException(
                    "Immagine troppo grande: %d byte, massimo %d".formatted(data.length, maxBytes));
        }
        return data;
    }

    /**
     * SVG is refused even when declared: it is a document, and serving one from this origin
     * on a public endpoint would let an upload run scripts on the dashboard's domain.
     */
    private String normalizeContentType(String mimeType) {
        if (!StringUtils.hasText(mimeType)) {
            throw new BadRequestException(
                    "Tipo dell'immagine non indicato: passare mimeType oppure un data URL");
        }
        String declared = mimeType.trim().toLowerCase(Locale.ROOT);
        if (!declared.startsWith(IMAGE_PREFIX)) {
            throw new BadRequestException("Tipo non valido: atteso un MIME type image/*");
        }
        if (SVG.equals(declared)) {
            throw new BadRequestException("SVG non accettato: usare un formato raster");
        }
        return declared;
    }
}
