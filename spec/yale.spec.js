const request = require("request-promise-native");
const yale = require("../src/yale");

jest.mock("request-promise-native");

const YALE_AUTH_TOKEN =
  "VnVWWDZYVjlXSUNzVHJhcUVpdVNCUHBwZ3ZPakxUeXNsRU1LUHBjdTpkd3RPbE15WEtENUJ5ZW1GWHV0am55eGhrc0U3V0ZFY2p0dFcyOXRaSWNuWHlSWHFsWVBEZ1BSZE1xczF4R3VwVTlxa1o4UE5ubGlQanY5Z2hBZFFtMHpsM0h4V3dlS0ZBcGZzakpMcW1GMm1HR1lXRlpad01MRkw3MGR0bmNndQ==";

describe("yale", () => {
  describe("getSession", () => {
    it("logs in with Yale", () => {
      request.mockResolvedValue({
        refresh_token: "mockRefreshToken",
        expires_in: 259200,
        scope: "groups read write basic_profile",
        access_token: "mockAccessToken",
        token_type: "Bearer"
      });

      yale.getSession("mockUser", "mockPass");

      const opts = {
        uri: "https://mob.yalehomesystem.co.uk/yapi/o/token/",
        headers: {
          Authorization: `Basic ${YALE_AUTH_TOKEN}`
        },
        form: {
          username: "mockUser",
          password: "mockPass",
          grant_type: "password"
        },
        method: "POST",
        json: true
      };

      return expect(request).toHaveBeenCalledWith(opts);
    });

    it("gets a session when successfully logging in with username and password", () => {
      request.mockResolvedValue({
        refresh_token: "mockRefreshToken",
        expires_in: 259200,
        scope: "groups read write basic_profile",
        access_token: "mockAccessToken",
        token_type: "Bearer"
      });

      const session = yale.getSession("mockUser", "mockPass");

      return expect(session).resolves.toEqual({
        refresh_token: "mockRefreshToken",
        expires_in: 259200,
        scope: "groups read write basic_profile",
        access_token: "mockAccessToken",
        token_type: "Bearer"
      });
    });

    it("throws an error when unsuccessful log in occurs", () => {
      request.mockResolvedValue({
        error: "invalid_grant",
        error_description: "Invalid credentials given."
      });

      const session = yale.getSession("mockUser", "mockPass");

      return expect(session).rejects.toBe("Incorrect account details provided");
    });
  });

  describe("getStatus", () => {
    it("gets the alarm status", () => {
      request.mockResolvedValue({
        result: true,
        code: "000",
        message: "OK!",
        token: "mockToken",
        data: [
          {
            area: "1",
            mode: "home"
          }
        ],
        time: "0.0024"
      });

      yale.getStatus({ access_token: "mockAccess" });

      const opts = {
        uri: "https://mob.yalehomesystem.co.uk/yapi/api/panel/mode/",
        headers: {
          Authorization: "Bearer mockAccess"
        },
        method: "GET",
        json: true
      };

      return expect(request).toHaveBeenCalledWith(opts);
    });

    it("gets disarmed status when disarmed", () => {
      request.mockResolvedValue({
        result: true,
        code: "000",
        message: "OK!",
        token: "mockToken",
        data: [
          {
            area: "1",
            mode: "disarm"
          }
        ],
        time: "0.0024"
      });

      const status = yale.getStatus({ access_token: "mockAccess" });

      return expect(status).resolves.toEqual(yale.DISARMED);
    });

    it("gets part armed status when part armed", () => {
      request.mockResolvedValue({
        result: true,
        code: "000",
        message: "OK!",
        token: "mockToken",
        data: [
          {
            area: "1",
            mode: "home"
          }
        ],
        time: "0.0024"
      });

      const status = yale.getStatus({ access_token: "mockAccess" });

      return expect(status).resolves.toEqual(yale.PART_ARMED);
    });

    it("gets armed status when armed", () => {
      request.mockResolvedValue({
        result: true,
        code: "000",
        message: "OK!",
        token: "mockToken",
        data: [
          {
            area: "1",
            mode: "arm"
          }
        ],
        time: "0.0024"
      });

      const status = yale.getStatus({ access_token: "mockAccess" });

      return expect(status).resolves.toEqual(yale.ARMED);
    });
  });
});
