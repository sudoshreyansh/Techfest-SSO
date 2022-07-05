# Techfest-MFA

This is a full-stack application server developed using the [Okta MFA Microservice](https://github.com/sudoshreyansh/mfa-microservice).

It's developed to showcase the capabilities of the microservice and implements the following:
- [x] Multi-factor authentication using email
- [x] Single sign-on

## Installation

Run `npm install` and create a `.env` file of the format:
```
PORT = <port number>
SESSION_SECRET = <random secret>
MICROSERVICE_URL = <url of authentication microservice>
```

and then run `node app.js` to run the SSO server.

