const { serverApp } = require("../server.js");
const request = require("supertest")(serverApp);
let expect = require("chai").expect;
const { faker } = require("@faker-js/faker");

const baseApiUrl = "/api";
const baseArticlesUrl = "/api/articles";
const baseUsersUrl = "/api/users";
const baseHangmanUrl = "/api/hangman";
const baseQuizUrl = "/api/quiz";
const baseStatsUrl = "/api/stats";
const baseCommentsUrl = "/api/comments";
const baseLoginUrl = "/api/login";
const baseLikesUrl = "/api/likes";

const existingUserEmail = "Danial.Dicki@dicki.test";
const existingUserPass = "test2";

const sleepTime = 50; // in ms
const logLevel = 2;
const clearDbAfter = true;

module.exports = {
  expect,
  request,
  faker,
  baseApiUrl,
  baseArticlesUrl,
  baseUsersUrl,
  baseLikesUrl,
  baseHangmanUrl,
  baseQuizUrl,
  baseStatsUrl,
  baseCommentsUrl,
  sleepTime,
  baseLoginUrl,
  existingUserPass,
  existingUserEmail,
  logLevel,
  clearDbAfter,
};
