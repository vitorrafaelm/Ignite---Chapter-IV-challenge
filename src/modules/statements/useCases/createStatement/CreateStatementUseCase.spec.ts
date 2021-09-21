import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

import { OperationType } from "../../entities/Statement";

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "vitor daniel",
      email: "vitor.rafael1518@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");

    if (user.id) {
      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        amount: 50,
        description: "Retirada de dinheiro",
        type: OperationType.DEPOSIT,
      });

      expect(statement).toHaveProperty("id");
    }
  });

  it("should not be able to create a statement if the user does not exixts", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '123456789',
        amount: 50,
        description: "Retirada de dinheiro",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
