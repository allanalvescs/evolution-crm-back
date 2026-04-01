import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager } from "@mikro-orm/postgresql";
import request from "supertest";
import { AppModule } from "src/app.module";
import { UserEntity } from "src/infrastructure/persistence/entities/user.entity";
import { CompanyEntity } from "src/infrastructure/persistence/entities/company.entity";

describe("Company (e2e)", () => {
  let app: INestApplication;
  let em: EntityManager;
  let accessToken: string;
  let registeredUserEmails: string[] = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useLogger(false);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    em = moduleRef.get(EntityManager);

    const signupRes = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        name: "Company Owner",
        email: "company.owner@e2e.com",
        password: "password123",
      });

    registeredUserEmails.push("company.owner@e2e.com");
    expect(signupRes.status).toBe(201);

    const signinRes = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({ email: "company.owner@e2e.com", password: "password123" });

    accessToken = signinRes.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  afterAll(async () => {
    const fork = em.fork();
    await fork.nativeDelete(CompanyEntity, {});
    if (registeredUserEmails.length > 0) {
      await fork.nativeDelete(UserEntity, {
        email: { $in: registeredUserEmails },
      });
    }
    await app.close();
  });

  afterEach(async () => {
    await em.fork().nativeDelete(CompanyEntity, {});
  });

  const validPayload = {
    tradeName: "Empresa Teste",
    companyName: "Empresa Teste Razão Social LTDA",
    cnpj: "11222333000181",
  };

  describe("POST /companies", () => {
    it("should return 201 and persist company when valid data is provided", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.tradeName).toBe(validPayload.tradeName);
      expect(response.body.companyName).toBe(validPayload.companyName);
      expect(response.body.cnpj).toBe(validPayload.cnpj);
      expect(response.body.phone).toBeNull();
      expect(response.body.userId).toBeDefined();
      expect(response.body.dtCreatedAt).toBeDefined();

      const companyInDb = await em
        .fork()
        .findOne(CompanyEntity, { cnpj: validPayload.cnpj });
      expect(companyInDb).not.toBeNull();
      expect(companyInDb!.tradeName).toBe(validPayload.tradeName);
    });

    it("should return 201 with optional phone", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ ...validPayload, phone: "11987654321" });

      expect(response.status).toBe(201);
      expect(response.body.phone).toBe("(11) 98765-4321");
    });

    it("should return 409 when CNPJ is already registered", async () => {
      await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(validPayload);

      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(validPayload);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Já existe uma empresa com esse CNPJ");
    });

    it("should return 409 when user already has a company", async () => {
      await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(validPayload);

      const anotherCnpj = { ...validPayload, cnpj: "45678901000195" };

      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(anotherCnpj);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Usuário já possui uma empresa cadastrada",
      );
    });

    it("should return 401 when no authentication token is provided", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .send(validPayload);

      expect(response.status).toBe(401);
    });

    it("should return 400 when CNPJ format is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ ...validPayload, cnpj: "123" });

      expect(response.status).toBe(400);
    });

    it("should return 400 when required fields are missing", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return 400 when tradeName is missing", async () => {
      const response = await request(app.getHttpServer())
        .post("/companies")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          companyName: validPayload.companyName,
          cnpj: validPayload.cnpj,
        });

      expect(response.status).toBe(400);
    });
  });
});
