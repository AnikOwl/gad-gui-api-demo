const { getCurrentDateTimeISO } = require("../helpers/datetime.helpers");
const {
  searchForUserWithToken,
  countLikesForArticle,
  countLikesForComment,
  checkIfAlreadyLiked,
} = require("../helpers/db-operation.helpers");
const {
  formatInvalidTokenErrorResponse,
  formatMissingFieldErrorResponse,
  formatOnlyOneFieldPossibleErrorResponse,
} = require("../helpers/helpers");
const { logTrace } = require("../helpers/logger-api");
const {
  HTTP_UNAUTHORIZED,
  HTTP_UNPROCESSABLE_ENTITY,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} = require("../helpers/response.helpers");
const {
  verifyAccessToken,
  are_mandatory_fields_present,
  mandatory_non_empty_fields_likes,
  is_likes_data_valid,
} = require("../helpers/validation.helpers");

function handleLikes(req, res, isAdmin) {
  const urlEnds = req.url.replace(/\/\/+/g, "/");

  if (req.method !== "GET" && urlEnds?.includes("/api/likes") && !isAdmin) {
    const verifyTokenResult = verifyAccessToken(req, res, "likes", req.url);
    const foundUser = searchForUserWithToken(req.headers["userid"], verifyTokenResult);

    if (foundUser === undefined || verifyTokenResult === false) {
      res.status(HTTP_UNAUTHORIZED).json(formatInvalidTokenErrorResponse());
      return;
    }
  }

  // user clicked like button:
  if (req.method === "POST" && urlEnds.endsWith("/api/likes")) {
    if (!are_mandatory_fields_present(req.body, mandatory_non_empty_fields_likes)) {
      res.status(HTTP_UNPROCESSABLE_ENTITY).json(formatMissingFieldErrorResponse(mandatory_non_empty_fields_likes));
      return;
    }
    if (is_likes_data_valid(req.body)) {
      res.status(HTTP_UNPROCESSABLE_ENTITY).json(formatOnlyOneFieldPossibleErrorResponse(["comment_id", "article_id"]));
      return;
    }

    const user_id = req.headers["userid"];
    const article_id = req.body["article_id"];
    const comment_id = req.body["comment_id"];

    const alreadyLiked = checkIfAlreadyLiked(article_id, comment_id, user_id);
    logTrace("handleLikes: alreadyLiked?", { alreadyLiked, user_id, body: req.body });

    if (alreadyLiked === true) {
      // TODO: unlike
      res.status(HTTP_OK).json({});
      return;
    } else {
      req.body["user_id"] = user_id;
      req.body["date"] = getCurrentDateTimeISO();

      logTrace("handleLikes: New like for:", { body: req.body });
    }

    return;
  }

  if (req.method === "GET" && urlEnds.includes("/api/likes/article/")) {
    const articleId = urlEnds.split("/").slice(-1)[0];
    if (articleId === undefined) {
      res.status(HTTP_NOT_FOUND).json({});
      return;
    }

    const likes = countLikesForArticle(articleId);
    logTrace("handleLikes: likes for article", { articleId, likes });
    res.status(HTTP_OK).json({ likes });
    return;
  }

  if (req.method === "GET" && urlEnds.includes("/api/likes/comments/")) {
    const commentId = urlEnds.split("/").slice(-1)[0];
    if (commentId === undefined) {
      res.status(HTTP_NOT_FOUND).json({});
      return;
    }

    const likes = countLikesForComment(commentId);
    logTrace("handleLikes: likes for comment", { commentId, likes });
    res.status(HTTP_OK).json({ likes });
    return;
  }

  if (req.method === "PUT" && urlEnds.includes("/api/likes")) {
    res.status(HTTP_METHOD_NOT_ALLOWED).json({});
    return;
  }

  if (req.method === "PATCH" && urlEnds.includes("/api/likes")) {
    res.status(HTTP_METHOD_NOT_ALLOWED).json({});
    return;
  }

  if (req.method === "GET" && urlEnds.endsWith("/api/likes")) {
    res.status(HTTP_METHOD_NOT_ALLOWED).json({});
    return;
  }

  return;
}

module.exports = {
  handleLikes,
};
