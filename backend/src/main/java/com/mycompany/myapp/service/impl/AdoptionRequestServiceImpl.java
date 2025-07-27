package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.AdoptionRequest;
import com.mycompany.myapp.domain.Animal;
import com.mycompany.myapp.domain.enumeration.AdoptionStatus;
import com.mycompany.myapp.domain.enumeration.RequestStatus;
import com.mycompany.myapp.repository.AdoptionRequestRepository;
import com.mycompany.myapp.repository.AnimalRepository;
import com.mycompany.myapp.service.AdoptionRequestService;
import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.service.AnimalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.AdoptionRequest}.
 */
@Service
@Transactional
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    private static final Logger LOG = LoggerFactory.getLogger(AdoptionRequestServiceImpl.class);

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final AnimalRepository animalRepository;
    private final AnimalService animalService;

    public AdoptionRequestServiceImpl(AdoptionRequestRepository adoptionRequestRepository, AnimalRepository animalRepository,AnimalService animalService) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.animalRepository = animalRepository;
        this.animalService = animalService;
    }

    @Override
    public AdoptionRequest save(AdoptionRequest adoptionRequest) {
//

        LOG.debug("Request to save AdoptionRequest : {}", adoptionRequest);
        adoptionRequest.setAdoptionStatus(RequestStatus.PENDING);


      /*  Animal AnimalOfAdoptionRequest = adoptionRequest.getAnimal();
        AnimalOfAdoptionRequest.setAdoptionStatus(AdoptedAdoptionStatus);
        animalService.save(AnimalOfAdoptionRequest);*/
        return adoptionRequestRepository.save(adoptionRequest);

    }

    @Override
    public AdoptionRequest update(AdoptionRequest adoptionRequest) {
        LOG.debug("Request to update AdoptionRequest : {}", adoptionRequest);

        return adoptionRequestRepository.save(adoptionRequest);
    }

    @Override
    public Optional<AdoptionRequest> partialUpdate(AdoptionRequest adoptionRequest) {
        LOG.debug("Request to partially update AdoptionRequest : {}", adoptionRequest);




        return adoptionRequestRepository
            .findById(adoptionRequest.getId())
            .map(existingAdoptionRequest -> {
                if (adoptionRequest.getReasonOfAdoption() != null) {
                    existingAdoptionRequest.setReasonOfAdoption(adoptionRequest.getReasonOfAdoption());
                }
                if (adoptionRequest.getAdoptionStatus() != null) {
                    existingAdoptionRequest.setAdoptionStatus(adoptionRequest.getAdoptionStatus());


                    if (existingAdoptionRequest.getAdoptionStatus() == RequestStatus.ACCEPTED) {  // <-- there's a mistake in the field name of adoption Request. It should be called RequestStatus instead of adoptionStatus, which is the same field name the animal has. But they're different.
                        Animal animal = existingAdoptionRequest.getAnimal();
                        if (animal != null) {

                            List<AdoptionRequest> otherRequests = adoptionRequestRepository
                                .findByAnimalAndIdNotAndAdoptionStatusNot(
                                    animal,
                                    existingAdoptionRequest.getId(),
                                    RequestStatus.ACCEPTED
                                );

                            // Update all other requests to REJECTED
                            otherRequests.forEach(request -> {
                                request.setAdoptionStatus(RequestStatus.REJECTED);
                                adoptionRequestRepository.save(request);
                            });

                            animal.setAdoptionStatus(AdoptionStatus.ADOPTED);
                            animalService.save(animal);

                        }
                    }
                    else if (existingAdoptionRequest.getAdoptionStatus() == RequestStatus.PENDING) {  // <-- there's a mistake in the field name of adoption Request. It should be called RequestStatus instead of adoptionStatus, which is the same field name the animal has. But they're different.
                        Animal animal = existingAdoptionRequest.getAnimal();
                        if (animal != null) {
                            animal.setAdoptionStatus(AdoptionStatus.AVAILABLE);
                            animalService.save(animal);
                        }
                    }







                }
                if (adoptionRequest.getEmail() != null) {
                    existingAdoptionRequest.setEmail(adoptionRequest.getEmail());
                }
                if (adoptionRequest.getPhoneNumber() != null) {
                    existingAdoptionRequest.setPhoneNumber(adoptionRequest.getPhoneNumber());
                }

                return existingAdoptionRequest;
            })
            .map(adoptionRequestRepository::save);


    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequest> findAll() {
        LOG.debug("Request to get all AdoptionRequests");
        return adoptionRequestRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdoptionRequest> findOne(Long id) {
        LOG.debug("Request to get AdoptionRequest : {}", id);
        return adoptionRequestRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AdoptionRequest : {}", id);
        adoptionRequestRepository.deleteById(id);
    }


}
