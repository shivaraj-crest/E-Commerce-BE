const express = require('express');
const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');
const Router = express.Router();

const {getAllAddress} = require('../controllers/addressController')

Router.use(authenticate);
Router.get('/',authorizeRole('user'),getAllAddress)

module.exports = Router