package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AnimalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Animal getAnimalSample1() {
        return new Animal().id(1L).name("name1").race("race1").age(1).gender("gender1");
    }

    public static Animal getAnimalSample2() {
        return new Animal().id(2L).name("name2").race("race2").age(2).gender("gender2");
    }

    public static Animal getAnimalRandomSampleGenerator() {
        return new Animal()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .race(UUID.randomUUID().toString())
            .age(intCount.incrementAndGet())
            .gender(UUID.randomUUID().toString());
    }
}
