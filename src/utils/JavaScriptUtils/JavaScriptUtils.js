import ResponseStatusCodes from '../../resources/ResponseStatusCodes/ResponseStatusCodes';

export const isDefined = value => typeof value !== 'undefined';

export const deepCopyObject = object => JSON.parse(JSON.stringify(object));

export const isResponseSucceeded = (statusCode) => {
  if (statusCode === ResponseStatusCodes.OK) {
    return true;
  }

  if (statusCode === ResponseStatusCodes.NO_CONTENT) {
    return true;
  }

  return false;
};
