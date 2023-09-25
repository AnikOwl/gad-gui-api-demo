const { userDb, articlesDb, commentsDb, getQuizHighScoresDb, saveQuizHighScoresDb, likesDb } = require("./db.helpers");

function searchForUserWithToken(userId, verifyTokenResult) {
  const foundUser = userDb().find((user) => {
    if (user["id"]?.toString() === userId?.toString() && user["email"] === verifyTokenResult.email) {
      return user;
    }
  });
  return foundUser;
}

function searchForUser(userId) {
  const foundUser = userDb().find((user) => {
    if (user["id"]?.toString() === userId?.toString()) {
      return user;
    }
  });
  return foundUser;
}

function searchForUserWithEmail(email) {
  const foundUser = userDb().find((user) => {
    if (user["email"]?.toString() === email?.toString()) {
      return user;
    }
  });
  return foundUser;
}

function searchForArticle(articleId) {
  const foundArticle = articlesDb().find((article) => {
    if (article["id"]?.toString() === articleId?.toString()) {
      return article;
    }
  });
  return foundArticle;
}

function searchForComment(commentId) {
  const foundComment = commentsDb().find((comment) => {
    if (comment["id"]?.toString() === commentId?.toString()) {
      return comment;
    }
  });
  return foundComment;
}

function countLikesForArticle(articleId) {
  const foundLikes = likesDb().filter((like) => {
    return like["article_id"]?.toString() === articleId?.toString();
  });
  return foundLikes.length;
}

function checkIfAlreadyLiked(articleId, commentId, userId) {
  const foundLikes = likesDb().find((like) => {
    return (
      ((like["article_id"]?.toString() === articleId?.toString() && articleId !== undefined) ||
        (like["article_id"] === undefined && articleId === undefined)) &&
      ((like["comment_id"]?.toString() === commentId?.toString() && commentId !== undefined) ||
        (like["comment_id"] === undefined && commentId === undefined)) &&
      like["user_id"]?.toString() === userId?.toString()
    );
  });
  return foundLikes !== undefined;
}

function countLikesForComment(commentId) {
  const foundLikes = likesDb().filter((like) => {
    return like["comment_id"]?.toString() === commentId?.toString();
  });
  return foundLikes.length;
}

function getGameByName(name) {
  const foundGame = getQuizHighScoresDb()["games"].find((game) => {
    if (game["name"]?.toString().toLowerCase() === name.toLowerCase()) {
      return game;
    }
  });
  return foundGame;
}

function getGameIdByName(name) {
  const foundGame = getGameByName(name);
  return foundGame["id"];
}

function getGameHighScoresByGameName(name) {
  const quizHighScores = getQuizHighScoresDb();
  const gameId = getGameIdByName(name);

  let scores = quizHighScores["scores"][gameId];

  if (scores == undefined) {
    scores = {};
  }

  return scores;
}

function saveGameHighScores(gameName, userEmail, score) {
  const quizHighScores = getGameHighScoresByGameName(gameName);
  const gameId = getGameIdByName(gameName);
  const foundUser = searchForUserWithEmail(userEmail);
  const userId = foundUser.id;

  if (quizHighScores[userId] === undefined || score >= quizHighScores[userId]) {
    quizHighScores[userId] = score;
  }

  saveQuizHighScoresDb(quizHighScores, gameId);
  return quizHighScores[userId];
}

module.exports = {
  searchForUserWithToken,
  searchForUserWithEmail,
  searchForUser,
  searchForArticle,
  searchForComment,
  getGameIdByName,
  getGameHighScoresByGameName,
  saveGameHighScores,
  countLikesForArticle,
  countLikesForComment,
  checkIfAlreadyLiked,
};
