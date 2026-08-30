package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * An image referenced from a flow's graph. Stored in the database rather than on disk so
 * a redeploy cannot lose it and there is no volume to keep in sync with the rows.
 */
@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
public class Image extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Plain byte[], deliberately without @Lob: that annotation would make Hibernate store
     * a large-object reference instead of the bytes, which is the mapping we had to
     * migrate away from. Unannotated it maps to bytea, which Postgres TOASTs by itself.
     */
    @Column(nullable = false)
    private byte[] data;

    /** Detected from the bytes on upload, since the payload carries only base64. */
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;
}
