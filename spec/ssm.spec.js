const ssm = require("../src/ssm");
const aws = require("aws-sdk-mock");

afterAll(() => {
  aws.restore("SSM");
});

describe("ssm", () => {
  const ssmGetParameters = jest.fn(async () => {
    return {
      Parameters: [
        { Name: "/nest-yale-alarm/yale-username", Value: "mockUsername" },
        { Name: "/nest-yale-alarm/yale-password", Value: "mockPassword" },
        { Name: "/nest-yale-alarm/nest-token", Value: "mockToken" }
      ]
    };
  });

  beforeAll(() => {
    aws.mock("SSM", "getParameters", ssmGetParameters);
  });

  it("requests Yale and Nest secrets from SSM with decryption", async () => {
    await ssm.getAuth();
    return expect(ssmGetParameters).toHaveBeenCalledWith(
      {
        Names: [
          "/nest-yale-alarm/yale-username",
          "/nest-yale-alarm/yale-password",
          "/nest-yale-alarm/nest-token"
        ],
        WithDecryption: true
      },
      expect.any(Function)
    );
  });

  it("retrieves Yale Username from SSM in /nest-yale-alarm/yale-username", async () => {
    const resp = ssm.getAuth();
    return expect(resp).resolves.toHaveProperty("yaleUser", "mockUsername");
  });

  it("retrieves Yale Password from SSM in /nest-yale-alarm/yale-password", async () => {
    const resp = ssm.getAuth();
    return expect(resp).resolves.toHaveProperty("yalePass", "mockPassword");
  });

  it("retrieves Nest Token from SSM in /nest-yale-alarm/nest-token", async () => {
    const resp = ssm.getAuth();
    return expect(resp).resolves.toHaveProperty("nestToken", "mockToken");
  });
});
