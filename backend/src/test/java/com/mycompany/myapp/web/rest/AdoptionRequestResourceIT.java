package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AdoptionRequestAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AdoptionRequest;
import com.mycompany.myapp.domain.enumeration.RequestStatus;
import com.mycompany.myapp.repository.AdoptionRequestRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AdoptionRequestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdoptionRequestResourceIT {

    private static final String DEFAULT_REASON_OF_ADOPTION = "AAAAAAAAAA";
    private static final String UPDATED_REASON_OF_ADOPTION = "BBBBBBBBBB";

    private static final RequestStatus DEFAULT_ADOPTION_STATUS = RequestStatus.PENDING;
    private static final RequestStatus UPDATED_ADOPTION_STATUS = RequestStatus.ACCEPTED;

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/adoption-requests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdoptionRequestMockMvc;

    private AdoptionRequest adoptionRequest;

    private AdoptionRequest insertedAdoptionRequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdoptionRequest createEntity() {
        return new AdoptionRequest()
            .reasonOfAdoption(DEFAULT_REASON_OF_ADOPTION)
            .adoptionStatus(DEFAULT_ADOPTION_STATUS)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdoptionRequest createUpdatedEntity() {
        return new AdoptionRequest()
            .reasonOfAdoption(UPDATED_REASON_OF_ADOPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);
    }

    @BeforeEach
    void initTest() {
        adoptionRequest = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAdoptionRequest != null) {
            adoptionRequestRepository.delete(insertedAdoptionRequest);
            insertedAdoptionRequest = null;
        }
    }

    @Test
    @Transactional
    void createAdoptionRequest() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AdoptionRequest
        var returnedAdoptionRequest = om.readValue(
            restAdoptionRequestMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AdoptionRequest.class
        );

        // Validate the AdoptionRequest in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAdoptionRequestUpdatableFieldsEquals(returnedAdoptionRequest, getPersistedAdoptionRequest(returnedAdoptionRequest));

        insertedAdoptionRequest = returnedAdoptionRequest;
    }

    @Test
    @Transactional
    void createAdoptionRequestWithExistingId() throws Exception {
        // Create the AdoptionRequest with an existing ID
        adoptionRequest.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdoptionRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isBadRequest());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAdoptionStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        adoptionRequest.setAdoptionStatus(null);

        // Create the AdoptionRequest, which fails.

        restAdoptionRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        adoptionRequest.setEmail(null);

        // Create the AdoptionRequest, which fails.

        restAdoptionRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        adoptionRequest.setPhoneNumber(null);

        // Create the AdoptionRequest, which fails.

        restAdoptionRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAdoptionRequests() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        // Get all the adoptionRequestList
        restAdoptionRequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adoptionRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].reasonOfAdoption").value(hasItem(DEFAULT_REASON_OF_ADOPTION)))
            .andExpect(jsonPath("$.[*].adoptionStatus").value(hasItem(DEFAULT_ADOPTION_STATUS.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)));
    }

    @Test
    @Transactional
    void getAdoptionRequest() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        // Get the adoptionRequest
        restAdoptionRequestMockMvc
            .perform(get(ENTITY_API_URL_ID, adoptionRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adoptionRequest.getId().intValue()))
            .andExpect(jsonPath("$.reasonOfAdoption").value(DEFAULT_REASON_OF_ADOPTION))
            .andExpect(jsonPath("$.adoptionStatus").value(DEFAULT_ADOPTION_STATUS.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingAdoptionRequest() throws Exception {
        // Get the adoptionRequest
        restAdoptionRequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdoptionRequest() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adoptionRequest
        AdoptionRequest updatedAdoptionRequest = adoptionRequestRepository.findById(adoptionRequest.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAdoptionRequest are not directly saved in db
        em.detach(updatedAdoptionRequest);
        updatedAdoptionRequest
            .reasonOfAdoption(UPDATED_REASON_OF_ADOPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restAdoptionRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdoptionRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAdoptionRequest))
            )
            .andExpect(status().isOk());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAdoptionRequestToMatchAllProperties(updatedAdoptionRequest);
    }

    @Test
    @Transactional
    void putNonExistingAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adoptionRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adoptionRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adoptionRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdoptionRequestWithPatch() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adoptionRequest using partial update
        AdoptionRequest partialUpdatedAdoptionRequest = new AdoptionRequest();
        partialUpdatedAdoptionRequest.setId(adoptionRequest.getId());

        partialUpdatedAdoptionRequest.phoneNumber(UPDATED_PHONE_NUMBER);

        restAdoptionRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdoptionRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdoptionRequest))
            )
            .andExpect(status().isOk());

        // Validate the AdoptionRequest in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdoptionRequestUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAdoptionRequest, adoptionRequest),
            getPersistedAdoptionRequest(adoptionRequest)
        );
    }

    @Test
    @Transactional
    void fullUpdateAdoptionRequestWithPatch() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adoptionRequest using partial update
        AdoptionRequest partialUpdatedAdoptionRequest = new AdoptionRequest();
        partialUpdatedAdoptionRequest.setId(adoptionRequest.getId());

        partialUpdatedAdoptionRequest
            .reasonOfAdoption(UPDATED_REASON_OF_ADOPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restAdoptionRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdoptionRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdoptionRequest))
            )
            .andExpect(status().isOk());

        // Validate the AdoptionRequest in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdoptionRequestUpdatableFieldsEquals(
            partialUpdatedAdoptionRequest,
            getPersistedAdoptionRequest(partialUpdatedAdoptionRequest)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adoptionRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adoptionRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adoptionRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdoptionRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adoptionRequest.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdoptionRequestMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(adoptionRequest)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdoptionRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdoptionRequest() throws Exception {
        // Initialize the database
        insertedAdoptionRequest = adoptionRequestRepository.saveAndFlush(adoptionRequest);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the adoptionRequest
        restAdoptionRequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, adoptionRequest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return adoptionRequestRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected AdoptionRequest getPersistedAdoptionRequest(AdoptionRequest adoptionRequest) {
        return adoptionRequestRepository.findById(adoptionRequest.getId()).orElseThrow();
    }

    protected void assertPersistedAdoptionRequestToMatchAllProperties(AdoptionRequest expectedAdoptionRequest) {
        assertAdoptionRequestAllPropertiesEquals(expectedAdoptionRequest, getPersistedAdoptionRequest(expectedAdoptionRequest));
    }

    protected void assertPersistedAdoptionRequestToMatchUpdatableProperties(AdoptionRequest expectedAdoptionRequest) {
        assertAdoptionRequestAllUpdatablePropertiesEquals(expectedAdoptionRequest, getPersistedAdoptionRequest(expectedAdoptionRequest));
    }
}
