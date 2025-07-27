package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AdoptionRequestTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AdoptionRequest getAdoptionRequestSample1() {
        return new AdoptionRequest().id(1L).email("email1").phoneNumber("phoneNumber1");
    }

    public static AdoptionRequest getAdoptionRequestSample2() {
        return new AdoptionRequest().id(2L).email("email2").phoneNumber("phoneNumber2");
    }

    public static AdoptionRequest getAdoptionRequestRandomSampleGenerator() {
        return new AdoptionRequest()
            .id(longCount.incrementAndGet())
            .email(UUID.randomUUID().toString())
            .phoneNumber(UUID.randomUUID().toString());
    }
}
