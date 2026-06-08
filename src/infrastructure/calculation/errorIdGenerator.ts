/**
 * Error ID Generator
 * @description Generates unique, URL-safe identifiers for error events
 */

const ALPHABET_LENGTH = 36;
const RANDOM_ID_LENGTH = 9;

const randomBase36Slice = (length: number): string => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * ALPHABET_LENGTH).toString(36);
  }
  return id;
};

export const generateErrorId = (): string => {
  const timestamp = Date.now();
  const randomPart = randomBase36Slice(RANDOM_ID_LENGTH);
  return `error_${timestamp}_${randomPart}`;
};
