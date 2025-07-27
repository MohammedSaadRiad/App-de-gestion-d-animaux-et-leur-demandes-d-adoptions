package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AdoptionRequestTestSamples.*;
import static com.mycompany.myapp.domain.AnimalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AnimalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Animal.class);
        Animal animal1 = getAnimalSample1();
        Animal animal2 = new Animal();
        assertThat(animal1).isNotEqualTo(animal2);

        animal2.setId(animal1.getId());
        assertThat(animal1).isEqualTo(animal2);

        animal2 = getAnimalSample2();
        assertThat(animal1).isNotEqualTo(animal2);
    }

    @Test
    void adoptionRequestionTest() {
        Animal animal = getAnimalRandomSampleGenerator();
        AdoptionRequest adoptionRequestBack = getAdoptionRequestRandomSampleGenerator();

        animal.addAdoptionRequestion(adoptionRequestBack);
        assertThat(animal.getAdoptionRequestions()).containsOnly(adoptionRequestBack);
        assertThat(adoptionRequestBack.getAnimal()).isEqualTo(animal);

        animal.removeAdoptionRequestion(adoptionRequestBack);
        assertThat(animal.getAdoptionRequestions()).doesNotContain(adoptionRequestBack);
        assertThat(adoptionRequestBack.getAnimal()).isNull();

        animal.adoptionRequestions(new HashSet<>(Set.of(adoptionRequestBack)));
        assertThat(animal.getAdoptionRequestions()).containsOnly(adoptionRequestBack);
        assertThat(adoptionRequestBack.getAnimal()).isEqualTo(animal);

        animal.setAdoptionRequestions(new HashSet<>());
        assertThat(animal.getAdoptionRequestions()).doesNotContain(adoptionRequestBack);
        assertThat(adoptionRequestBack.getAnimal()).isNull();
    }
}
