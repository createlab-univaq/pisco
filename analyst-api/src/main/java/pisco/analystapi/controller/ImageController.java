package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import pisco.analystapi.model.dto.ImageDTO;
import pisco.analystapi.model.dto.ImageUploadDTO;
import pisco.analystapi.model.entity.Image;
import pisco.analystapi.service.ImageService;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Immagini",
        description = "Immagini referenziate dai flow. Il download e' pubblico: l'id e' un UUID "
                + "e l'immagine fa parte di un flow che il paziente deve poter vedere.")
public class ImageController {

    private final ImageService service;

    /**
     * Public, and the only route that returns bytes. Everything else here speaks JSON.
     */
    @Operation(
            summary = "Scarica un'immagine",
            description = "Endpoint pubblico: restituisce i byte con il Content-Type rilevato "
                    + "al caricamento. Chiunque conosca l'id puo' scaricarla.")
    @SecurityRequirements
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable UUID id, WebRequest request) {
        log.info("GET /api/images/{}", id);
        Image image = service.requireById(id);

        // A PUT keeps the id and moves updatedAt, so that is what identifies a version.
        String eTag = "\"" + image.getUpdatedAt().toEpochMilli() + "\"";
        if (request.checkNotModified(eTag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(eTag).build();
        }

        return ResponseEntity.ok()
                // Cached, but revalidated: the bytes behind an id can be replaced.
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
                .eTag(eTag)
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .contentLength(image.getSizeBytes())
                // Tell the browser not to guess a type of its own and possibly land on
                // something executable.
                .header("X-Content-Type-Options", "nosniff")
                .body(image.getData());
    }

    @Operation(
            summary = "Carica un'immagine",
            description = "Il corpo e' {\"image\": \"<base64>\", \"mimeType\": \"image/png\"}; "
                    + "in alternativa image puo' essere un data URL, che porta il tipo con se'. "
                    + "Il tipo non viene mai dedotto dai byte: senza mimeType ne' data URL la "
                    + "richiesta e' 400, come per un tipo non image/*. image/svg+xml e' sempre "
                    + "rifiutato. La dimensione massima e' app.images.max-size.")
    @PostMapping
    public ResponseEntity<ImageDTO> create(@Valid @RequestBody ImageUploadDTO dto) {
        log.info("POST /api/images");
        ImageDTO created = service.create(dto.getImage(), dto.getMimeType());
        return ResponseEntity.created(URI.create("/api/images/" + created.getId())).body(created);
    }

    @Operation(
            summary = "Sostituisce un'immagine",
            description = "Stesso corpo del POST, mimeType incluso. L'id resta lo stesso, "
                    + "quindi i flow che la referenziano continuano a funzionare.")
    @PutMapping("/{id}")
    public ImageDTO replace(@PathVariable UUID id, @Valid @RequestBody ImageUploadDTO dto) {
        log.info("PUT /api/images/{}", id);
        return service.replace(id, dto.getImage(), dto.getMimeType());
    }

    @Operation(
            summary = "Elimina un'immagine",
            description = "Nessun controllo sui flow che la referenziano: flowJson e' opaco "
                    + "per questo servizio, quindi un grafo puo' restare con un id che da 404.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/images/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
