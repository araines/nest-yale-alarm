const request = require("request-promise");

const ARMED = "arm";
const PART_ARMED = "home";
const DISARMED = "disarm";

const urls = {
  login: "https://www.yalehomesystem.co.uk/homeportal/api/login/check_login",
  logout: "https://www.yalehomesystem.co.uk/homeportal/api/logout",
  getStatus:
    "https://www.yalehomesystem.co.uk/homeportal/api/panel/get_panel_mode",
  setState:
    "https://www.yalehomesystem.co.uk/homeportal/api/panel/set_panel_mode?area=1&mode="
};

const getSession = async (username, password) => {
  const cookieJar = request.jar();
  const opts = {
    uri: urls.login,
    jar: cookieJar,
    form: {
      id: username,
      password
    },
    method: "POST",
    json: true
  };
  const response = await request(opts);

  if (response.result !== "1") {
    throw "Incorrect account details provided";
  }

  return {
    username,
    password,
    cookieJar
  };
};

const endSession = async session => {
  const opts = {
    uri: urls.logout,
    jar: session.cookieJar,
    method: "POST"
  };
  await request(opts);
};

const getStatus = async session => {
  const opts = {
    uri: urls.getStatus,
    jar: session.cookieJar,
    form: {
      id: session.username,
      password: session.password
    },
    method: "POST",
    json: true
  };
  const response = await request(opts);

  if (response.result !== "1") {
    throw "Unable to get status";
  }

  return response.message[0].mode;
};

const setState = async (session, state) => {
  const opts = {
    uri: urls.setState + state,
    jar: session.cookieJar,
    method: "POST",
    json: true
  };
  await request(opts);
};

module.exports = {
  getSession,
  endSession,
  getStatus,
  setState,
  ARMED,
  PART_ARMED,
  DISARMED
};
