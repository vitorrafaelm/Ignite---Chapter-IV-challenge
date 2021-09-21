import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../showUserProfile/ShowUserProfileError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUseUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    await createUseUseCase.execute({
      name: "User Informations To Show",
      email: "userinfo@mail.com",
      password: "12345678",
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: 'userinfo@mail.com',
      password: '12345678',
    });

    expect(userAuthenticated).toHaveProperty('token');

  });

  it("should not be able to authenticate an user that does not exists", async () => {
    expect(async () => {
      await createUseUseCase.execute({
        name: "User Informations2 To Show",
        email: "userinfo2@mail.com",
        password: "12345678",
      });

      await authenticateUserUseCase.execute({
        email: 'userinfo1.8@mail.com',
        password: '12345678',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user if the password does not match", async () => {
    expect(async () => {
      await createUseUseCase.execute({
        name: "User Informations2 To Show",
        email: "userinfo1.8@mail.com",
        password: "12345678",
      });

      await authenticateUserUseCase.execute({
        email: 'userinfo1.8@mail.com',
        password: '12345',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
