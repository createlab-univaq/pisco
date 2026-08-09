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
 * Lookup for the kind of node a {@link GameAnswer} was recorded against (spec section
 * 4.2). The label is the string Polyglot itself uses, and it is unique: telemetry arrives
 * naming the type rather than its id, so the label is what a write resolves against.
 */
@Entity
@Table(name = "node_types")
@Getter
@Setter
@NoArgsConstructor
public class NodeType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String label;

    public NodeType(String label) {
        this.label = label;
    }
}
