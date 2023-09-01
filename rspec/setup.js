var chai = require('chai');
const request = require('supertest');
const app = require('../app');
const ClassInfoModel = require('../model/classInfo');
const FeedBackModel = require('../model/feedBack');
const HomeWorkModel = require('../model/homeWork');
const PublishWorkModel = require('../model/publishWork');
const SubjectModel = require('../model/subject');
const UserModel = require('../model/user');

const expect = chai.expect;

require('./mongodb.setup')
module.exports = {
  request,
  app,
  expect,
  ClassInfoModel,
  FeedBackModel,
  HomeWorkModel,
  PublishWorkModel,
  SubjectModel,
  UserModel
};
