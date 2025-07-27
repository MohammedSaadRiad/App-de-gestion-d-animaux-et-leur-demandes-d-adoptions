package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AdoptionRequestTestSamples.*;
import static com.mycompany.myapp.domain.AnimalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdoptionRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdoptionRequest.class);
        AdoptionRequest adoptionRequest1 = getAdoptionRequestSample1();
        AdoptionRequest adoptionRequest2 = new AdoptionRequest();
        assertThat(adoptionRequest1).isNotEqualTo(adoptionRequest2);

        adoptionRequest2.setId(adoptionRequest1.getId());
        assertThat(adoptionRequest1).isEqualTo(adoptionRequest2);

        adoptionRequest2 = getAdoptionRequestSample2();
        assertThat(adoptionRequest1).isNotEqualTo(adoptionRequest2);
    }

    @Test
    void animalTest() {
        AdoptionRequest adoptionRequest = getAdoptionRequestRandomSampleGenerator();
        Animal animalBack = getAnimalRandomSampleGenerator();

        adoptionRequest.setAnimal(animalBack);
        assertThat(adoptionRequest.getAnimal()).isEqualTo(animalBack);

        adoptionRequest.animal(null);
        assertThat(adoptionRequest.getAnimal()).isNull();
    }
}
