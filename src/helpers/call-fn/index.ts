export default (callback: Function | any, ...args: any): any => {
  if (callback && typeof callback === 'function') {
    return callback(...args);
  }

  return args.length === 1 ? args[0] : args;
}
