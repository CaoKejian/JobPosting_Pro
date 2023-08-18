var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const UserModel = require('../../model/user.js');
chai.use(chaiHttp);
const expect = chai.expect;
require('../mongodb.setup.js')