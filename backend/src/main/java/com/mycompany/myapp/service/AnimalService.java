package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Animal;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Animal}.
 */
public interface AnimalService {
    /**
     * Save a animal.
     *
     * @param animal the entity to save.
     * @return the persisted entity.
     */
    Animal save(Animal animal);

    /**
     * Updates a animal.
     *
     * @param animal the entity to update.
     * @return the persisted entity.
     */
    Animal update(Animal animal);

    /**
     * Partially updates a animal.
     *
     * @param animal the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Animal> partialUpdate(Animal animal);

    /**
     * Get all the animals.
     *
     * @return the list of entities.
     */
    List<Animal> findAll();

    /**
     * Get the "id" animal.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Animal> findOne(Long id);

    /**
     * Delete the "id" animal.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
