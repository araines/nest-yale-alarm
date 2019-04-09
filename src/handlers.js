const nest = require("./nest");
const yale = require("./yale");
const ssm = require("./ssm");

const log = console.log;

log("Getting secrets from SSM");
const secrets = ssm.getAuth();

const update = async (event, context) => {
  log("Logging in");
  const auth = await secrets;
  const structure = nest.getStructure(auth.nestToken);
  const session = yale.getSession(auth.yaleUser, auth.yalePass);

  log("Getting current status / state");
  const status = yale.getStatus(await session);
  const state = nest.getState(auth.nestToken, await structure);

  log(`Status received - Yale: ${await status} Nest: ${await state}`);
  let resp;
  if (
    [yale.ARMED, yale.PART_ARMED].includes(await status) &&
    (await state) === nest.HOME
  ) {
    log("Setting AWAY");
    resp = nest.setAway(auth.nestToken, structure);
  } else if ((await status) === yale.DISARMED && (await state) === nest.AWAY) {
    log("Setting HOME");
    resp = nest.setHome(auth.nestToken, structure);
  } else {
    log("No action required");
  }

  log("Logging out");
  yale.endSession(session);
};

module.exports = {
  update
};
