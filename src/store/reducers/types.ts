import {AxiosError} from 'axios';

export type DataProperty<T> = Nullable<T | AxiosError>;
