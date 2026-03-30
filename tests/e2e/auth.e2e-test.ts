import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager } from "@mikro-orm/postgresql";
import request from "supertest";
import { AppModule } from "src/app.module";
import { UserEntity } from "src/infrastructure/persistence/entities/user.entity";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let em: EntityManager;
  let registeredEmails: string[] = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    em = moduleRef.get(EntityManager);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    if (registeredEmails.length > 0) {
      await em
        .fork()
        .nativeDelete(UserEntity, { email: { $in: registeredEmails } });
      registeredEmails = [];
    }
  });

  describe("POST /auth/signup", () => {
    it("should return 201 and persist user when valid data is provided", async () => {
      const payload = {
        name: "John",
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app.getHttpServer())
        .post("/auth/signup")
        .send(payload);

      registeredEmails.push(payload.email);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(payload.email);
      expect(response.body.name).toBe(payload.name);
      expect(response.body.role).toBe("ADMIN");

      const userInDb = await em
        .fork()
        .findOne(UserEntity, { email: payload.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb!.email).toBe(payload.email);
    });

    it("should return 400 when email is already registered", async () => {
      const payload = {
        name: "John",
        email: "john.doe@example.com",
        password: "password123",
      };

      await request(app.getHttpServer()).post("/auth/signup").send(payload);
      registeredEmails.push(payload.email);

      const response = await request(app.getHttpServer())
        .post("/auth/signup")
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Já existe um usuário com esse email");
    });
  });

  describe("POST /auth/signin", () => {
    it("should return 201 and return access token when credentials are valid", async () => {
      const payload = {
        name: "John",
        email: "john.doe@example.com",
        password: "password123",
      };

      await request(app.getHttpServer()).post("/auth/signup").send(payload);
      registeredEmails.push(payload.email);

      const response = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({ email: payload.email, password: payload.password });

      expect(response.status).toBe(201);
      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe("string");
      expect(response.body.accessToken.length).toBeGreaterThan(0);
    });

    it("should return 401 when credentials are invalid", async () => {
      const payload = {
        name: "John",
        email: "john.doe@example.com",
        password: "password123",
      };

      await request(app.getHttpServer()).post("/auth/signup").send(payload);
      registeredEmails.push(payload.email);

      const response = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({ email: payload.email, password: "wrong-password" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Credenciais inválidas");
    });
  });
});
