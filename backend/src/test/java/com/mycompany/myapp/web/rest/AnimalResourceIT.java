package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AnimalAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Animal;
import com.mycompany.myapp.domain.enumeration.AdoptionStatus;
import com.mycompany.myapp.repository.AnimalRepository;
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
 * Integration tests for the {@link AnimalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnimalResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_RACE = "AAAAAAAAAA";
    private static final String UPDATED_RACE = "BBBBBBBBBB";

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final String DEFAULT_GENDER = "M";
    private static final String UPDATED_GENDER = "F";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final AdoptionStatus DEFAULT_ADOPTION_STATUS = AdoptionStatus.AVAILABLE;
    private static final AdoptionStatus UPDATED_ADOPTION_STATUS = AdoptionStatus.ADOPTED;

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/animals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnimalMockMvc;

    private Animal animal;

    private Animal insertedAnimal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Animal createEntity() {
        return new Animal()
            .name(DEFAULT_NAME)
            .race(DEFAULT_RACE)
            .age(DEFAULT_AGE)
            .gender(DEFAULT_GENDER)
            .description(DEFAULT_DESCRIPTION)
            .adoptionStatus(DEFAULT_ADOPTION_STATUS)
            .imageUrl(DEFAULT_IMAGE_URL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Animal createUpdatedEntity() {
        return new Animal()
            .name(UPDATED_NAME)
            .race(UPDATED_RACE)
            .age(UPDATED_AGE)
            .gender(UPDATED_GENDER)
            .description(UPDATED_DESCRIPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .imageUrl(UPDATED_IMAGE_URL);
    }

    @BeforeEach
    void initTest() {
        animal = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAnimal != null) {
            animalRepository.delete(insertedAnimal);
            insertedAnimal = null;
        }
    }

    @Test
    @Transactional
    void createAnimal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Animal
        var returnedAnimal = om.readValue(
            restAnimalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Animal.class
        );

        // Validate the Animal in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAnimalUpdatableFieldsEquals(returnedAnimal, getPersistedAnimal(returnedAnimal));

        insertedAnimal = returnedAnimal;
    }

    @Test
    @Transactional
    void createAnimalWithExistingId() throws Exception {
        // Create the Animal with an existing ID
        animal.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRaceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        animal.setRace(null);

        // Create the Animal, which fails.

        restAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAgeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        animal.setAge(null);

        // Create the Animal, which fails.

        restAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenderIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        animal.setGender(null);

        // Create the Animal, which fails.

        restAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAdoptionStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        animal.setAdoptionStatus(null);

        // Create the Animal, which fails.

        restAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAnimals() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        // Get all the animalList
        restAnimalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(animal.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].race").value(hasItem(DEFAULT_RACE)))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].adoptionStatus").value(hasItem(DEFAULT_ADOPTION_STATUS.toString())))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGE_URL)));
    }

    @Test
    @Transactional
    void getAnimal() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        // Get the animal
        restAnimalMockMvc
            .perform(get(ENTITY_API_URL_ID, animal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(animal.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.race").value(DEFAULT_RACE))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.adoptionStatus").value(DEFAULT_ADOPTION_STATUS.toString()))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGE_URL));
    }

    @Test
    @Transactional
    void getNonExistingAnimal() throws Exception {
        // Get the animal
        restAnimalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAnimal() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the animal
        Animal updatedAnimal = animalRepository.findById(animal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAnimal are not directly saved in db
        em.detach(updatedAnimal);
        updatedAnimal
            .name(UPDATED_NAME)
            .race(UPDATED_RACE)
            .age(UPDATED_AGE)
            .gender(UPDATED_GENDER)
            .description(UPDATED_DESCRIPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .imageUrl(UPDATED_IMAGE_URL);

        restAnimalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnimal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAnimal))
            )
            .andExpect(status().isOk());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAnimalToMatchAllProperties(updatedAnimal);
    }

    @Test
    @Transactional
    void putNonExistingAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(put(ENTITY_API_URL_ID, animal.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isBadRequest());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(animal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(animal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnimalWithPatch() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the animal using partial update
        Animal partialUpdatedAnimal = new Animal();
        partialUpdatedAnimal.setId(animal.getId());

        partialUpdatedAnimal.gender(UPDATED_GENDER);

        restAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnimal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnimal))
            )
            .andExpect(status().isOk());

        // Validate the Animal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnimalUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAnimal, animal), getPersistedAnimal(animal));
    }

    @Test
    @Transactional
    void fullUpdateAnimalWithPatch() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the animal using partial update
        Animal partialUpdatedAnimal = new Animal();
        partialUpdatedAnimal.setId(animal.getId());

        partialUpdatedAnimal
            .name(UPDATED_NAME)
            .race(UPDATED_RACE)
            .age(UPDATED_AGE)
            .gender(UPDATED_GENDER)
            .description(UPDATED_DESCRIPTION)
            .adoptionStatus(UPDATED_ADOPTION_STATUS)
            .imageUrl(UPDATED_IMAGE_URL);

        restAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnimal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAnimal))
            )
            .andExpect(status().isOk());

        // Validate the Animal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAnimalUpdatableFieldsEquals(partialUpdatedAnimal, getPersistedAnimal(partialUpdatedAnimal));
    }

    @Test
    @Transactional
    void patchNonExistingAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, animal.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(animal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(animal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        animal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnimalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(animal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Animal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnimal() throws Exception {
        // Initialize the database
        insertedAnimal = animalRepository.saveAndFlush(animal);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the animal
        restAnimalMockMvc
            .perform(delete(ENTITY_API_URL_ID, animal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return animalRepository.count();
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

    protected Animal getPersistedAnimal(Animal animal) {
        return animalRepository.findById(animal.getId()).orElseThrow();
    }

    protected void assertPersistedAnimalToMatchAllProperties(Animal expectedAnimal) {
        assertAnimalAllPropertiesEquals(expectedAnimal, getPersistedAnimal(expectedAnimal));
    }

    protected void assertPersistedAnimalToMatchUpdatableProperties(Animal expectedAnimal) {
        assertAnimalAllUpdatablePropertiesEquals(expectedAnimal, getPersistedAnimal(expectedAnimal));
    }
}
