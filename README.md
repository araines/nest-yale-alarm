[![CircleCI](https://circleci.com/gh/araines/nest-yale-alarm.svg?style=shield)](https://circleci.com/gh/araines/nest-yale-alarm)

# nest-yale-alarm

Project to set Nest Home/Away status when Yale Smart Home Alarm is armed/disarmed.

## How it Works

Yale does not provide a proper API for this kind of thing, nor any access to the push notifications that are sent when the alarm status changes. This project runs on AWS Lambda, using Cloudwatch Events to trigger a poll operation every 15 minutes. The status of the Yale alarm is checked on each run and then the appropriate state is set on Nest.

## Security Credentials setup

This project relies upon AWS SSM. The following SSM parameters must be configured in AWS as Secure Strings:

- `/nest-yale-alarm/yale-username`: The Yale Smart Home Alarm system username
- `/nest-yale-alarm/yale-password`: The Yale Smart Home Alarm system password
- `/nest-yale-alarm/nest-token`: The Nest token

## Generating a Nest token

1. Go to [https://developers.nest.com](https://developers.nest.com)

2. Go to the Console and sign in with your normal account

3. Create a new OAuth Client:

   - **Product Name**: _YaleAlarm_ + your name (must be unique)
   - **Description**: _Open source project to integrate with Yale Smart Home Alarm systems to allow for away to be set when the alarm is set and home to be set when the alarm is disarmed_
   - **Categories**: _Home Automation_
   - **Users**: _Individual_
   - **Support URL**: _https://github.com/araines/nest-yale-alarm_
   - **Redirect URL**: _[LEAVE BLANK]_
   - **Permissions (minimum)**:
     _ Enable **Away** with **read/write**
     _ Permission description: fill in anything

4. Browse to the **Authorization URL** for the new client, accept the terms and copy the **pin code**

5. Get a token by executing the following curl command:

```
curl -X POST \
  https://api.home.nest.com/oauth2/access_token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=PIN_CODE&grant_type=authorization_code'
```

6. Copy the **access token** returned in to the SSM location - this is the nest token.

## Deployment

1. Clone the project, then install:

```
yarn
```

2. Deploy using serverless framework:

```
sls deploy
```

## Development

### Testing

Run tests:

```
yarn test
```
