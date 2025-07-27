package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.AdoptionRequest;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.AdoptionRequest}.
 */
public interface AdoptionRequestService {
    /**
     * Save a adoptionRequest.
     *
     * @param adoptionRequest the entity to save.
     * @return the persisted entity.
     */
    AdoptionRequest save(AdoptionRequest adoptionRequest);

    /**
     * Updates a adoptionRequest.
     *
     * @param adoptionRequest the entity to update.
     * @return the persisted entity.
     */
    AdoptionRequest update(AdoptionRequest adoptionRequest);

    /**
     * Partially updates a adoptionRequest.
     *
     * @param adoptionRequest the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AdoptionRequest> partialUpdate(AdoptionRequest adoptionRequest);

    /**
     * Get all the adoptionRequests.
     *
     * @return the list of entities.
     */
    List<AdoptionRequest> findAll();

    /**
     * Get the "id" adoptionRequest.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdoptionRequest> findOne(Long id);

    /**
     * Delete the "id" adoptionRequest.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
