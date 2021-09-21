import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUseUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUseUseCase.execute({
      name: "User Test",
      email: "usertest@mail.com",
      password: "12345678",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user if the email is already registered", () => {
    expect(async () => {
      await createUseUseCase.execute({
        name: "User Test 2",
        email: "usertest2@mail.com",
        password: "12345678",
      });

      const user = await createUseUseCase.execute({
        name: "User Test 2",
        email: "usertest2@mail.com",
        password: "12345678",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
