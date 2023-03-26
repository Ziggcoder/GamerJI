
export const CleanData = async (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] == "") {
      delete obj[propName];
    }
  }
  return obj
}
