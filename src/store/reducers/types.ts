import {AxiosError} from 'axios';

export type DataProperty<T> = Maybe<T | AxiosError>;

export type StoreProperty<T> = Nullable<T | AxiosError>;
