const {
  formatErrorResponse,
  parseUserStats,
  parseArticleStats,
  parsePublishStats,
  getIdFromUrl,
  formatInvalidTokenErrorResponse,
  getRandomInt,
  sleep,
} = require("../helpers/helpers");
const { logDebug, logError, logTrace } = require("../helpers/logger-api");
const { getConfigValue } = require("../config/config-manager");
const { ConfigKeys } = require("../config/enums");

const { validateEmail, verifyAccessToken } = require("../helpers/validation.helpers");
const { searchForUserWithToken } = require("../helpers/db-operation.helpers");
const { HTTP_UNAUTHORIZED, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } = require("../helpers/response.helpers");
const { handleHangman } = require("../endpoints/hangman-endpoint.helpers");
const { handleQuiz } = require("../endpoints/quiz-endpoint.helpers");
const { handleConfig } = require("../endpoints/config-endpoint.helpers");
const { handleUsers } = require("../endpoints/users-endpoint.helpers");
const { handleArticles } = require("../endpoints/articles-endpoint.helpers");
const { handleComments } = require("../endpoints/comments-endpoint.helpers");

const validations = (req, res, next) => {
  let isAdmin = false;

  try {
    const urlEnds = req.url.replace(/\/\/+/g, "/");

    // check if JSON:
    if (
      (req.url.includes("/api/users") ||
        req.url.includes("/api/comments") ||
        req.url.includes("/api/articles") ||
        req.url.includes("/api/plugins")) &&
      req.body?.length > 0
    ) {
      try {
        JSON.parse(req.body);
      } catch (error) {
        logError(`Error: ${JSON.stringify(error)}`);
        res.status(HTTP_BAD_REQUEST).send(formatErrorResponse("Bad request - malformed JSON"));
        return;
      }
    }

    // check if admin:
    try {
      let verifyTokenResult = verifyAccessToken(req, res, "isAdmin", req.url);
      if (
        verifyTokenResult?.email === getConfigValue(ConfigKeys.ADMIN_USER_EMAIL) ||
        verifyTokenResult?.email === getConfigValue(ConfigKeys.SUPER_ADMIN_USER_EMAIL)
      ) {
        isAdmin = true;
        logDebug("validations: isAdmin:", isAdmin);
      }
    } catch (error) {
      logError("Error: check if admin:", {
        error,
      });
    }

    if (req.url.includes("/api/config")) {
      handleConfig(req, res);
      return;
    }
    if (req.url.includes("/api/hangman")) {
      handleHangman(req, res);
      return;
    }
    if (req.url.includes("/api/quiz")) {
      handleQuiz(req, res);
      return;
    }

    if (
      req.method !== "GET" &&
      req.method !== "POST" &&
      req.method !== "HEAD" &&
      urlEnds.includes("/api/users") &&
      !isAdmin
    ) {
      logTrace("Validators: Check user auth", { url: urlEnds });
      let userId = getIdFromUrl(urlEnds);
      const verifyTokenResult = verifyAccessToken(req, res, "users", req.url);
      if (!verifyTokenResult) return;

      const foundUser = searchForUserWithToken(userId, verifyTokenResult);

      if (foundUser === undefined) {
        res.status(HTTP_UNAUTHORIZED).send(formatInvalidTokenErrorResponse());
        return;
      }
    }

    if (
      (urlEnds?.includes("/api/articles/upload") && !isAdmin) ||
      (req.method !== "GET" && req.method !== "HEAD" && urlEnds?.includes("/api/articles") && !isAdmin)
    ) {
      const verifyTokenResult = verifyAccessToken(req, res, "articles", req.url);
      if (!verifyTokenResult) return;
    }

    if (req.method !== "GET" && req.method !== "HEAD" && urlEnds.includes("/api/comments") && !isAdmin) {
      const verifyTokenResult = verifyAccessToken(req, res, "comments", req.url);
      if (!verifyTokenResult) return;
    }

    if (req.url.includes("/api/users")) {
      handleUsers(req, res);
    }

    if (req.url.includes("/api/articles")) {
      handleArticles(req, res, isAdmin);
    }

    if (req.url.includes("/api/comments")) {
      handleComments(req, res, isAdmin);
    }

    logTrace("Returning:", { statusCode: res.statusCode, headersSent: res.headersSent, urlEnds, method: req.method });

    if (res.headersSent !== true) {
      logTrace("Processing with next()...");

      if (req.method === "GET" && urlEnds.includes("api/comments")) {
        let limit = urlEnds.split("_limit=")[1];
        limit = limit?.split("&")[0];
        let timeout = getConfigValue(ConfigKeys.SLEEP_TIME_PER_ONE_GET_COMMENT);
        logTrace(`[DELAY] Getting sleep time:`, { limit, timeout });
        if (limit !== undefined) {
          timeout =
            limit *
            getRandomInt(
              getConfigValue(ConfigKeys.SLEEP_TIME_PER_ONE_GET_COMMENT_MIN),
              getConfigValue(ConfigKeys.SLEEP_TIME_PER_ONE_GET_COMMENT_MAX)
            );
          logDebug(`[DELAY] Waiting for ${timeout} [ms] to load ${limit} comments`);
        }
        logDebug(`[DELAY] Waiting for ${timeout} [ms] for ${urlEnds}`);
        sleep(timeout).then(() => next());
      } else {
        next();
      }
    }
  } catch (error) {
    logError("Fatal error. Please contact administrator.", {
      error,
      stack: error.stack,
    });
    res.status(HTTP_INTERNAL_SERVER_ERROR).send(formatErrorResponse("Fatal error. Please contact administrator."));
  }
};

exports.validations = validations;
exports.validateEmail = validateEmail;
