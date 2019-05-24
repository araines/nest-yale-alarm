const request = require("request-promise-native");

const HOME = "home";
const AWAY = "away";

const baseUrl = "https://developer-api.nest.com";

const getStructure = async token => {
  const opts = {
    uri: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  };
  const response = await request(opts);

  return Object.keys(response.structures)[0];
};

const getState = async (token, structure) => {
  const opts = {
    uri: stateUrl(structure),
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  };
  return await request(opts);
};

const setHome = (token, structure) => setState(token, structure, HOME);

const setAway = (token, structure) => setState(token, structure, AWAY);

const setState = async (token, structure, state) => {
  const opts = {
    uri: stateUrl(structure),
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "PUT",
    json: true,
    body: state,
    followAllRedirects: true
  };
  return await request(opts);
};

const stateUrl = structure => `${baseUrl}/structures/${structure}/away`;

module.exports = {
  getStructure,
  getState,
  setHome,
  setAway,
  HOME,
  AWAY
};
