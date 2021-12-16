const sendRequest = require('../util/sendRequest');
const endpoints = require('../util/endpoints');

function render( viewName ) {
    return (req, res) => {
        res.render(viewName);
    }
}

async function success( req, res ) {
    if (
        typeof req.session.redirect_uri !== 'string'
    ) {
        res.render('success');
        return;
    }

    let authCode = await sendRequest(endpoints.GenerateGrant, JSON.stringify({
        sessionId: req.session.sessionId
    }));
    authCode = JSON.parse(authCode);
    res.redirect(req.session.redirect_uri + `?code=${authCode.code}&state=${req.session.state}&mfa=${req.session.mfa ? '1' : '0'}`);
}

async function checkAuthenticated( req, res, next ) {
    if ( req.session.sessionId && req.url !== '/success' && req.url !== '/verification' ) {
        if ( req.session.mfa ) {
            res.redirect('/verification');
        } else {
            res.redirect('/success');
        }        
    } else {
        next();
    }
}

async function saveSSOData(req, res, next) {
    if (
        typeof req.query.redirect_uri === 'string' &&
        typeof req.query.state === 'string'
    ) {
        req.session.redirect_uri = req.query.redirect_uri;
        req.session.state = req.query.state;
        req.session.mfa = (req.query.mfa === '1');
    }

    next();
}

async function signup( req, res ) {
    let response = await sendRequest(endpoints.Register, JSON.stringify(req.body));
    response = JSON.parse(response);

    if ( !response.error ) {
        req.session.userId = response.userId;
        res.redirect('/activate');
    } else {
        res.redirect('/signup');
    }
}

async function login( req, res ) {
    let response = await sendRequest(endpoints.Login, JSON.stringify(req.body));
    response = JSON.parse(response);

    if ( !response.error ) {
        if ( response.id ) {
            req.session.userId = response.userId;
            req.session.sessionId = response.id;
            if ( req.session.mfa ) {
                res.redirect('/verification');
            } else {
                res.redirect("/success");   
            }
        } else {
            req.session.userId = response.userId;
            res.redirect('/activate');
        }
    } else {
        res.redirect("/");
    }
}

async function renderVerification( req, res ) {
    let response = await sendRequest(endpoints.MFA, JSON.stringify({
        userId: req.session.userId
    }));
    response = JSON.parse(response);
    res.render('mfa');
}

async function verification( req, res ) {
    let response = await sendRequest(endpoints.MFA, JSON.stringify({
        userId: req.session.userId,
        otp: req.body.code
    }));
    response = JSON.parse(response);
    
    if ( !response.error ) {
        req.session.mfa = true;
        res.redirect('/success');
    } else {
        res.redirect('/verification');
    }
}

async function activate( req, res ) {
    let response = await sendRequest(endpoints.AccountActivate, JSON.stringify({
        userId: req.session.userId,
        otp: req.body.code
    }));
    response = JSON.parse(response);
    
    if ( !response.error ) {
        res.redirect('/');
    } else {
        res.redirect('/activate');
    }
}

module.exports = {
    render,
    signup,
    login,
    verification,
    activate,
    checkAuthenticated,
    success,
    saveSSOData,
    renderVerification
}