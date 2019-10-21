import ResponseStatusCodes from "../../resources/ResponseStatusCodes/ResponseStatusCodes";

export const isDefined = value =>
  typeof value !== "undefined" && value !== null;

export const deepCopyObject = object => JSON.parse(JSON.stringify(object));

export const isSuccess = statusCode => {
  if (statusCode === ResponseStatusCodes.OK) {
    return true;
  }

  if (statusCode === ResponseStatusCodes.NO_CONTENT) {
    return true;
  }

  return false;
};

export const elementExists = id => {
  const element = document.getElementById(id);

  return isDefined(element);
};
