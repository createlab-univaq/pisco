package pisco.analystapi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Upload payload. A data URL prefix is tolerated and stripped. */
@Getter
@Setter
@NoArgsConstructor
public class ImageUploadDTO {

    @NotBlank
    private String image;

    /** Optional: without it the type is read from the bytes. */
    @Pattern(regexp = "^image/[A-Za-z0-9.+-]+$", message = "deve essere un MIME type image/*")
    @Size(max = 100)
    private String mimeType;
}
