package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Animal;
import com.mycompany.myapp.repository.AnimalRepository;
import com.mycompany.myapp.service.AnimalService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Animal}.
 */
@Service
@Transactional
public class AnimalServiceImpl implements AnimalService {

    private static final Logger LOG = LoggerFactory.getLogger(AnimalServiceImpl.class);

    private final AnimalRepository animalRepository;

    public AnimalServiceImpl(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    @Override
    public Animal save(Animal animal) {
        LOG.debug("Request to save Animal : {}", animal);
        return animalRepository.save(animal);
    }

    @Override
    public Animal update(Animal animal) {
        LOG.debug("Request to update Animal : {}", animal);
        return animalRepository.save(animal);
    }

    @Override
    public Optional<Animal> partialUpdate(Animal animal) {
        LOG.debug("Request to partially update Animal : {}", animal);

        return animalRepository
            .findById(animal.getId())
            .map(existingAnimal -> {
                if (animal.getName() != null) {
                    existingAnimal.setName(animal.getName());
                }
                if (animal.getRace() != null) {
                    existingAnimal.setRace(animal.getRace());
                }
                if (animal.getAge() != null) {
                    existingAnimal.setAge(animal.getAge());
                }
                if (animal.getGender() != null) {
                    existingAnimal.setGender(animal.getGender());
                }
                if (animal.getDescription() != null) {
                    existingAnimal.setDescription(animal.getDescription());
                }
                if (animal.getAdoptionStatus() != null) {
                    existingAnimal.setAdoptionStatus(animal.getAdoptionStatus());
                }
                if (animal.getImageUrl() != null) {
                    existingAnimal.setImageUrl(animal.getImageUrl());
                }

                return existingAnimal;
            })
            .map(animalRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Animal> findAll() {
        LOG.debug("Request to get all Animals");
        return animalRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Animal> findOne(Long id) {
        LOG.debug("Request to get Animal : {}", id);
        return animalRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Animal : {}", id);
        animalRepository.deleteById(id);
    }
}
