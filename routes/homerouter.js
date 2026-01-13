const express = require('express');
const homerouter = express.Router();

const  homecontroller= require('../controllers/homecontroller');

homerouter.get('/',homecontroller.gethome);
homerouter.get('/aboutus',homecontroller.getaboutus);
homerouter.get('/Contactus',homecontroller.getcontactus);
homerouter.get('/login',homecontroller.getlogin);
homerouter.post('/login',homecontroller.postlogin);
homerouter.get('/api/data',homecontroller.getapidata);
homerouter.post('/contact/postrequest',homecontroller.postreqdata);
exports.homeRouter = homerouter;