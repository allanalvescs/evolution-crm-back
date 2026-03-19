import { JwtTokenGenerator } from "./jwt-token-generator";
import { EUserRole } from "../../shared/enum/user-role.enum";
import { JwtService } from "@nestjs/jwt";

describe("JwtTokenGenerator", () => {
  let jwtTokenGenerator: JwtTokenGenerator;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockJwtService = {
      signAsync: jest.fn(),
    } as any;

    jwtTokenGenerator = new JwtTokenGenerator(mockJwtService);
  });

  it("Should be generate a token with payload and return a string", async () => {
    const mockToken = "mocked-jwt-token-string";
    const payload = {
      sub: "user-id-123",
      email: "test@example.com",
      role: EUserRole.ADMIN,
    };

    mockJwtService.signAsync.mockResolvedValue(mockToken);

    const result = await jwtTokenGenerator.generate(payload);

    expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockToken);
    expect(typeof result).toBe("string");
  });
});