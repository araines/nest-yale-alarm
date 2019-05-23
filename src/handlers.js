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
  if (shouldSetAway(await status, await state)) {
    log("Setting AWAY");
    nest.setAway(auth.nestToken, structure);
  } else if (shouldSetHome(await status, await state)) {
    log("Setting HOME");
    nest.setHome(auth.nestToken, structure);
  } else {
    log("No action required");
  }
};

const shouldSetAway = (yaleStatus, nestState) => {
  return (
    [yale.ARMED, yale.PART_ARMED].includes(yaleStatus) &&
    nest.HOME === nestState
  );
};

const shouldSetHome = (yaleStatus, nestState) => {
  return yale.DISARMED === yaleStatus && nest.AWAY === nestState;
};

module.exports = {
  update
};
