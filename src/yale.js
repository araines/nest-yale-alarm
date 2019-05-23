const request = require("request-promise-native");

const ARMED = "arm";
const PART_ARMED = "home";
const DISARMED = "disarm";

const urls = {
  token: "https://mob.yalehomesystem.co.uk/yapi/o/token/",
  getStatus: "https://mob.yalehomesystem.co.uk/yapi/api/panel/mode/"
};
const AUTH_TOKEN =
  "VnVWWDZYVjlXSUNzVHJhcUVpdVNCUHBwZ3ZPakxUeXNsRU1LUHBjdTpkd3RPbE15WEtENUJ5ZW1GWHV0am55eGhrc0U3V0ZFY2p0dFcyOXRaSWNuWHlSWHFsWVBEZ1BSZE1xczF4R3VwVTlxa1o4UE5ubGlQanY5Z2hBZFFtMHpsM0h4V3dlS0ZBcGZzakpMcW1GMm1HR1lXRlpad01MRkw3MGR0bmNndQ==";

const getSession = async (username, password) => {
  const opts = {
    uri: urls.token,
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    },
    form: {
      username,
      password,
      grant_type: "password"
    },
    method: "POST",
    json: true
  };
  const response = await request(opts);

  if (!response.access_token) {
    throw "Incorrect account details provided";
  }

  return response;
};

const getStatus = async session => {
  const opts = {
    uri: urls.getStatus,
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    method: "GET",
    json: true
  };
  const response = await request(opts);

  return response.data[0].mode;
};

module.exports = {
  getSession,
  getStatus,
  ARMED,
  PART_ARMED,
  DISARMED
};
