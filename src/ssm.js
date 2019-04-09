const aws = require("aws-sdk");

const keys = {
  "/nest-yale-alarm/yale-username": "yaleUser",
  "/nest-yale-alarm/yale-password": "yalePass",
  "/nest-yale-alarm/nest-token": "nestToken"
};

const getAuth = async () => {
  const ssm = new aws.SSM();
  const resp = await ssm
    .getParameters({ Names: Object.keys(keys), WithDecryption: true })
    .promise();

  const auth = {};
  resp.Parameters.forEach(parameter => {
    const name = keys[parameter.Name];
    auth[name] = parameter.Value;
  });

  return auth;
};

module.exports = {
  getAuth
};
