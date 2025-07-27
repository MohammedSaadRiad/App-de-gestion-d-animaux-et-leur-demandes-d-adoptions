package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AdoptionRequest;
import com.mycompany.myapp.domain.Animal;
import com.mycompany.myapp.domain.enumeration.RequestStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the AdoptionRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    @Query("SELECT ar FROM AdoptionRequest ar " +
        "WHERE ar.animal = :animal " +
        "AND ar.id != :id " +
        "AND ar.adoptionStatus != :status")
    List<AdoptionRequest> findByAnimalAndIdNotAndAdoptionStatusNot(
        @Param("animal") Animal animal,
        @Param("id") Long id,
        @Param("status") RequestStatus status
    );
}
