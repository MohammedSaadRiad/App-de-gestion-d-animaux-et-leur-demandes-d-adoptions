package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.AdoptionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Animal.
 */
@Entity
@Table(name = "animal")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Animal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "race", nullable = false)
    private String race;

    @NotNull
    @Column(name = "age", nullable = false)
    private Integer age;

    @NotNull
    @Size(min = 1, max = 1)
    @Pattern(regexp = "[MF]")
    @Column(name = "gender", length = 1, nullable = false)
    private String gender;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "adoption_status", nullable = false)
    private AdoptionStatus adoptionStatus;

    @Lob
    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "animal")
    @JsonIgnoreProperties(value = { "animal" }, allowSetters = true)
    private Set<AdoptionRequest> adoptionRequestions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Animal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Animal name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRace() {
        return this.race;
    }

    public Animal race(String race) {
        this.setRace(race);
        return this;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public Integer getAge() {
        return this.age;
    }

    public Animal age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return this.gender;
    }

    public Animal gender(String gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDescription() {
        return this.description;
    }

    public Animal description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AdoptionStatus getAdoptionStatus() {
        return this.adoptionStatus;
    }

    public Animal adoptionStatus(AdoptionStatus adoptionStatus) {
        this.setAdoptionStatus(adoptionStatus);
        return this;
    }

    public void setAdoptionStatus(AdoptionStatus adoptionStatus) {
        this.adoptionStatus = adoptionStatus;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Animal imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<AdoptionRequest> getAdoptionRequestions() {
        return this.adoptionRequestions;
    }

    public void setAdoptionRequestions(Set<AdoptionRequest> adoptionRequests) {
        if (this.adoptionRequestions != null) {
            this.adoptionRequestions.forEach(i -> i.setAnimal(null));
        }
        if (adoptionRequests != null) {
            adoptionRequests.forEach(i -> i.setAnimal(this));
        }
        this.adoptionRequestions = adoptionRequests;
    }

    public Animal adoptionRequestions(Set<AdoptionRequest> adoptionRequests) {
        this.setAdoptionRequestions(adoptionRequests);
        return this;
    }

    public Animal addAdoptionRequestion(AdoptionRequest adoptionRequest) {
        this.adoptionRequestions.add(adoptionRequest);
        adoptionRequest.setAnimal(this);
        return this;
    }

    public Animal removeAdoptionRequestion(AdoptionRequest adoptionRequest) {
        this.adoptionRequestions.remove(adoptionRequest);
        adoptionRequest.setAnimal(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Animal)) {
            return false;
        }
        return getId() != null && getId().equals(((Animal) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Animal{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", race='" + getRace() + "'" +
            ", age=" + getAge() +
            ", gender='" + getGender() + "'" +
            ", description='" + getDescription() + "'" +
            ", adoptionStatus='" + getAdoptionStatus() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            "}";
    }
}
