import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUseUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile Informations", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able list a user profile informations", async () => {
    const userCreated = await createUseUseCase.execute({
      name: "User Informations To Show",
      email: "userinfo@mail.com",
      password: "12345678",
    });

    expect(userCreated).toHaveProperty('id');

    if(userCreated.id){
      const user = await showUserProfileUseCase.execute(userCreated.id);

      expect(user).toBeDefined();
    }
  });
});
