const endpoints = {
    MFA: '/api/mfa/verify',
    AccountActivate: '/api/activate',
    Register: '/api/register',
    Login: '/api/login',
    GenerateGrant: '/api/sso/grant'
};

for ( endpoint in endpoints ) {
    endpoints[endpoint] = process.env.MICROSERVICE_URL + endpoints[endpoint];
}

module.exports = endpoints;