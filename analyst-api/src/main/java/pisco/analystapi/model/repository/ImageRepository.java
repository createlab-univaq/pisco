package pisco.analystapi.model.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Image;

public interface ImageRepository extends JpaRepository<Image, UUID> {}
