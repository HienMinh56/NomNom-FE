let accessToken = null;
let userInfo = null;

function setTokens(access, user) {
  accessToken = access;
  userInfo = user;
}

function getAccessToken() {
  return accessToken;
}

function getUserInfo() {
  return userInfo;
}

module.exports = { setTokens, getAccessToken, getUserInfo };