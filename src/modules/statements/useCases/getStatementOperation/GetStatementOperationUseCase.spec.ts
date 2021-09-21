import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get user's statement", async () => {
    const user = await createUserUseCase.execute({
      name: "vitor daniel",
      email: "vitor.rafael15187@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");

    if (user.id) {
      if (user.id) {
        const statement = await createStatementUseCase.execute({
          user_id: user.id,
          amount: 50,
          description: "Retirada de dinheiro",
          type: OperationType.DEPOSIT,
        });

        expect(statement).toHaveProperty("id");

        if (statement.id) {
          const balance = await getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: statement.id,
          });

          expect(balance).toHaveProperty("balance");
        }
      }
    }
  });

  it("should not be able to get balance if the user does not exixts", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123456789",
        statement_id: '1234567',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
