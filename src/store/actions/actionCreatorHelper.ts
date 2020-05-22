import {AxiosError} from 'axios';

export const infoActionCreator = <TType extends string>(type: TType) => {
  return () => ({type} as const);
};

export const loadedActionCreator = <TType extends string, TParams>(
  type: TType,
) => {
  return (payload: TParams) => ({type, payload} as const);
};

export const fetchActionCreator = <
  TType extends string,
  TParams extends object
>(
  type: TType,
) => {
  return loadedActionCreator<TType, TParams>(type);
};

export const dataActionCreator = <
  TType extends string,
  TPayload,
  TParams extends object = {}
>(
  type: TType,
) => {
  return loadedActionCreator<TType, {data: TPayload} & TParams>(type);
};

export const fetchedActionCreator = <
  TType extends string,
  TPayload,
  TParams extends object = {}
>(
  type: TType,
) => {
  return dataActionCreator<TType, TPayload | AxiosError, TParams>(type);
};
