import {AxiosError} from 'axios';

export const infoActionCreator = <T extends string>(type: T) => {
  return () => ({type} as const);
};

export const loadedActionCreator = <T extends string, P>(type: T) => {
  return (payload: P) => ({type, payload} as const);
};

export const fetchActionCreator = <
  T extends string,
  P extends Record<string, number>
>(
  type: T,
) => {
  return loadedActionCreator<T, P>(type);
};

export const fetchedActionCreator = <T extends string, P>(type: T) => {
  return loadedActionCreator<T, P | AxiosError>(type);
};
