module.exports = function (id) {
  try {
    if (id.startsWith('GE') && id.endsWith('GESP01')) {
      const splittedId = id.split('/');
      if (
        splittedId.length === 3 &&
        splittedId[1].startsWith('2022') &&
        splittedId[1].length === 8
      ) {
        id = parseInt(splittedId[1]);
        //if it's not an integer
        if (!Number.isInteger(id)) return 'Invalid identity number';

        return null;
      }
    }
  } catch (ex) {
    console.log(ex);
    return 'Invalid identity number';
  }

  return 'Invalid identity number';
};
