export const debounce = <A extends unknown[]>(
  fn: (...args: A) => void,
  ms = 250,
): ((...args: A) => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, ms);
  };
};
