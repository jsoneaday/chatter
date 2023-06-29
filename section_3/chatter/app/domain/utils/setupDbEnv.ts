import { faker } from "@faker-js/faker";
import { NewProfile, createProfile } from "../entities/profile";
const avatar = require("./avatar.png");

export async function setupDbEnv() {
  // create main profile
  await createProfile(
    new NewProfile(
      "current_user",
      faker.name.fullName(),
      faker.lorem.sentence(5),
      "usa",
      faker.internet.url(),
      avatar
    )
  );

  // create followable profiles
  for (let i = 0; i < 11; i++) {
    createProfile(
      new NewProfile(
        `${faker.name.firstName()}_${faker.name.lastName}`,
        faker.name.fullName(),
        faker.lorem.sentence(5),
        "usa",
        faker.internet.url(),
        avatar
      )
    );
  }

  // have main profile follow multiple profiles

  // create messages for followed profiles
}
