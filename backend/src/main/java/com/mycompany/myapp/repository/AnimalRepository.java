package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Animal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Animal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {}
