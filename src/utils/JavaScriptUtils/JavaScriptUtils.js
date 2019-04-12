export const isDefined = value => typeof value !== 'undefined';

export const deepCopyObject = object => JSON.parse(JSON.stringify(object));
