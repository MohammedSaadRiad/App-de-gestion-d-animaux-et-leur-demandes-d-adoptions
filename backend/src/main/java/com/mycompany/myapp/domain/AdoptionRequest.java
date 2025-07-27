package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.RequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A AdoptionRequest.
 */
@Entity
@Table(name = "adoption_request")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdoptionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "reason_of_adoption", nullable = false)
    private String reasonOfAdoption;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "adoption_status", nullable = false)
    private RequestStatus adoptionStatus;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    private Animal animal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AdoptionRequest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReasonOfAdoption() {
        return this.reasonOfAdoption;
    }

    public AdoptionRequest reasonOfAdoption(String reasonOfAdoption) {
        this.setReasonOfAdoption(reasonOfAdoption);
        return this;
    }

    public void setReasonOfAdoption(String reasonOfAdoption) {
        this.reasonOfAdoption = reasonOfAdoption;
    }

    public RequestStatus getAdoptionStatus() {
        return this.adoptionStatus;
    }

    public AdoptionRequest adoptionStatus(RequestStatus adoptionStatus) {
        this.setAdoptionStatus(adoptionStatus);
        return this;
    }

    public void setAdoptionStatus(RequestStatus adoptionStatus) {
        this.adoptionStatus = adoptionStatus;
    }

    public String getEmail() {
        return this.email;
    }

    public AdoptionRequest email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public AdoptionRequest phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Animal getAnimal() {
        return this.animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public AdoptionRequest animal(Animal animal) {
        this.setAnimal(animal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdoptionRequest)) {
            return false;
        }
        return getId() != null && getId().equals(((AdoptionRequest) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdoptionRequest{" +
            "id=" + getId() +
            ", reasonOfAdoption='" + getReasonOfAdoption() + "'" +
            ", adoptionStatus='" + getAdoptionStatus() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            "}";
    }
}
