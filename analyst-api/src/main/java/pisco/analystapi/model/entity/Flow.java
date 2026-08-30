package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Map;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

/**
 * A learning flow, authored here rather than fetched from Polyglot. The structure itself
 * stays unmodelled: it is whatever the React Flow editor saves, and this service never
 * reads inside it.
 */
@Entity
@Table(
        name = "flows",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_flows_name_analyst",
                columnNames = {"name", "analyst_id"}),
        indexes = @Index(name = "idx_flows_analyst", columnList = "analyst_id"))
@Getter
@Setter
@NoArgsConstructor
public class Flow extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * The author. Names are unique per analyst rather than globally, so two of them can
     * each keep a flow called "Introduzione" without colliding.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "analyst_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Analyst analyst;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    /** Read by the front end to decide what to show. It gates nothing server-side. */
    @Column(nullable = false)
    private boolean published;

    /**
     * The React Flow graph, stored as jsonb. A Map rather than a String so it travels as
     * real JSON in both directions instead of an escaped blob; Hibernate serializes it
     * with the Jackson mapper Spring Boot already configures.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "flow_json", columnDefinition = "jsonb")
    private Map<String, Object> flowJson;
}
