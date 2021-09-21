import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to get user's balance", async () => {
    const user = await createUserUseCase.execute({
      name: "vitor daniel",
      email: "vitor.rafael15187@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");

    if (user.id) {
      const balance = await getBalanceUseCase.execute({
        user_id: user.id,
      });

      expect(balance).toHaveProperty("balance");
    }
  });

  it("should not be able to get balance if the user does not exixts", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: '123456789',
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
