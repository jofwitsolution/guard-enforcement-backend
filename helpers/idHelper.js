module.exports = function (id) {
  const splittedId = id.split('/');
  return splittedId[1];
};
