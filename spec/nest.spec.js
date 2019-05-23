const nest = require("../src/nest");
const request = require("request-promise-native");

jest.mock("request-promise-native");

describe("nest", () => {
  describe("getStructure", () => {
    it("gets the structure id within the Nest account", () => {
      request.mockResolvedValue({
        structures: {
          structureId: { id: "structureId" }
        }
      });

      const resp = nest.getStructure("testToken");

      expect(request).toHaveBeenCalledWith({
        uri: "https://developer-api.nest.com",
        headers: { Authorization: "Bearer testToken" },
        json: true
      });

      return expect(resp).resolves.toBe("structureId");
    });
  });

  describe("getState", () => {
    it("gets the home/away state for the given structure", () => {
      request.mockResolvedValue("away");

      const resp = nest.getState("testToken", "testStructure");

      expect(request).toHaveBeenCalledWith({
        uri: "https://developer-api.nest.com/structures/testStructure/away",
        headers: { Authorization: "Bearer testToken" },
        json: true
      });

      return expect(resp).resolves.toBe("away");
    });
  });

  describe("setHome", () => {
    it("sets home/away state to home for the given structure", () => {
      nest.setHome("testToken", "testStructure");

      expect(request).toHaveBeenCalledWith({
        uri: "https://developer-api.nest.com/structures/testStructure/away",
        headers: { Authorization: "Bearer testToken" },
        json: true,
        method: "PUT",
        body: "home",
        followAllRedirects: true
      });
    });
  });

  describe("setAway", () => {
    it("sets home/away state to away for the given structure", () => {
      nest.setAway("testToken", "testStructure");

      expect(request).toHaveBeenCalledWith({
        uri: "https://developer-api.nest.com/structures/testStructure/away",
        headers: { Authorization: "Bearer testToken" },
        json: true,
        method: "PUT",
        body: "away",
        followAllRedirects: true
      });
    });
  });

  it("has the constant HOME", () => {
    expect(nest.HOME).toBe("home");
  });

  it("has the constant AWAY", () => {
    expect(nest.AWAY).toBe("away");
  });
});
