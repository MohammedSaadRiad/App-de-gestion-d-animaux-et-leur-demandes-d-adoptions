package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.AdoptionRequest;
import com.mycompany.myapp.repository.AdoptionRequestRepository;
import com.mycompany.myapp.service.AdoptionRequestService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.AdoptionRequest}.
 */
@RestController
@RequestMapping("/api/adoption-requests")
public class AdoptionRequestResource {

    private static final Logger LOG = LoggerFactory.getLogger(AdoptionRequestResource.class);

    private static final String ENTITY_NAME = "adoptionRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdoptionRequestService adoptionRequestService;

    private final AdoptionRequestRepository adoptionRequestRepository;

    public AdoptionRequestResource(AdoptionRequestService adoptionRequestService, AdoptionRequestRepository adoptionRequestRepository) {
        this.adoptionRequestService = adoptionRequestService;
        this.adoptionRequestRepository = adoptionRequestRepository;
    }

    /**
     * {@code POST  /adoption-requests} : Create a new adoptionRequest.
     *
     * @param adoptionRequest the adoptionRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adoptionRequest, or with status {@code 400 (Bad Request)} if the adoptionRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AdoptionRequest> createAdoptionRequest(@Valid @RequestBody AdoptionRequest adoptionRequest)
        throws URISyntaxException {
        LOG.debug("REST request to save AdoptionRequest : {}", adoptionRequest);
        if (adoptionRequest.getId() != null) {
            throw new BadRequestAlertException("A new adoptionRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        adoptionRequest = adoptionRequestService.save(adoptionRequest);
        return ResponseEntity.created(new URI("/api/adoption-requests/" + adoptionRequest.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, adoptionRequest.getId().toString()))
            .body(adoptionRequest);
    }

    /**
     * {@code PUT  /adoption-requests/:id} : Updates an existing adoptionRequest.
     *
     * @param id the id of the adoptionRequest to save.
     * @param adoptionRequest the adoptionRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adoptionRequest,
     * or with status {@code 400 (Bad Request)} if the adoptionRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adoptionRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdoptionRequest> updateAdoptionRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AdoptionRequest adoptionRequest
    ) throws URISyntaxException {
        LOG.debug("REST request to update AdoptionRequest : {}, {}", id, adoptionRequest);
        if (adoptionRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adoptionRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adoptionRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        adoptionRequest = adoptionRequestService.update(adoptionRequest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adoptionRequest.getId().toString()))
            .body(adoptionRequest);
    }

    /**
     * {@code PATCH  /adoption-requests/:id} : Partial updates given fields of an existing adoptionRequest, field will ignore if it is null
     *
     * @param id the id of the adoptionRequest to save.
     * @param adoptionRequest the adoptionRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adoptionRequest,
     * or with status {@code 400 (Bad Request)} if the adoptionRequest is not valid,
     * or with status {@code 404 (Not Found)} if the adoptionRequest is not found,
     * or with status {@code 500 (Internal Server Error)} if the adoptionRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdoptionRequest> partialUpdateAdoptionRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AdoptionRequest adoptionRequest
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AdoptionRequest partially : {}, {}", id, adoptionRequest);
        if (adoptionRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adoptionRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adoptionRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdoptionRequest> result = adoptionRequestService.partialUpdate(adoptionRequest);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adoptionRequest.getId().toString())
        );
    }

    /**
     * {@code GET  /adoption-requests} : get all the adoptionRequests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adoptionRequests in body.
     */
    @GetMapping("")
    public List<AdoptionRequest> getAllAdoptionRequests() {
        LOG.debug("REST request to get all AdoptionRequests");
        return adoptionRequestService.findAll();
    }

    /**
     * {@code GET  /adoption-requests/:id} : get the "id" adoptionRequest.
     *
     * @param id the id of the adoptionRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adoptionRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdoptionRequest> getAdoptionRequest(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AdoptionRequest : {}", id);
        Optional<AdoptionRequest> adoptionRequest = adoptionRequestService.findOne(id);
        return ResponseUtil.wrapOrNotFound(adoptionRequest);
    }

    /**
     * {@code DELETE  /adoption-requests/:id} : delete the "id" adoptionRequest.
     *
     * @param id the id of the adoptionRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoptionRequest(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AdoptionRequest : {}", id);
        adoptionRequestService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
