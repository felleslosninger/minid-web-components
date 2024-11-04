export const debounce = (
  callback: Function,
  wait: number,
  options?: Partial<{
    stopPropagation: boolean;
  }>
) => {
  let timeoutId: number | undefined = undefined;
  return (...args: [any, any]) => {
    if (options?.stopPropagation) {
      (args[0] as Event).stopPropagation();
    }

    window.clearTimeout(timeoutId);
    if (wait < 1) {
      callback(...args);
      return;
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
