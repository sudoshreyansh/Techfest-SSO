const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.get('/', controller.saveSSOData);

router.all('*', controller.checkAuthenticated);

router.get('/signup', controller.render('signup'));
router.post('/signup', controller.signup);

router.post('/', controller.login);
router.get('/', controller.render('login'));

router.get('/verification', controller.render('mfa'));
router.post('/verification', controller.verification);

router.get('/activate', controller.render('mfa'));
router.post('/activate', controller.activate);

router.get('/success', controller.success);

module.exports = router;