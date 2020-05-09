import { AxiosInstance } from 'axios';
import {Includes, InsertAfterEach} from 'definitions/mixins';

declare global {
    declare type OmitCommon<T extends K, K> = Omit<T, keyof K>;

    declare type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

    declare type OptionalizeCommon<T extends K, K> = Omit<T, keyof K> & Partial<K>;

    declare type ArrayElement<ArrayType extends unknown[]> = ArrayType[number];

    declare type Maybe<T> = T | undefined;

    declare type Key = string | number;

    declare type Dictionary<T, K extends Key = string> = K extends string ? { [key: string]: T } : { [key: number]: T };

    declare type PartialDictionary<T, K extends Key = string> = Partial<Dictionary<T, K>>;

    declare type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

    declare type Yield<T> = T extends import('redux-saga').EventChannel<infer U1>
      ? U1
      : ReturnType<T> extends Promise<infer U2>
        ? U2
        : ReturnType<T> extends Generator<unknown, infer U3>
          ? U3
          : ReturnType<T>;

    declare interface Window {
        APIRequest: AxiosInstance;
    }

    declare const VK: any;

    declare namespace NodeJS {
        export interface ProcessEnv {
            REACT_APP_BASE_URL: string;
        }
    }

    declare namespace _ {
        export interface LoDashStatic {
            insertAfterEach: InsertAfterEach;
            includes: Includes;
        }
    }

    declare namespace React {
        export type withDefaultProps<T extends React.FunctionComponent<infer P> | React.ComponentClass<infer P> | ForwardRefExoticComponent<infer P>> = T & Required<Pick<T, 'defaultProps'>>;

        export type Defaultize<P, D> = P extends any
            ? string extends keyof P ? P :
                & Pick<P, Exclude<keyof P, keyof D>>
                & Partial<Pick<P, Extract<keyof P, keyof D>>>
                & Partial<Pick<D, Exclude<keyof D, keyof P>>>
            : never;
    }

    declare interface HTMLFormControlsCollection {
        [name: string]: HTMLInputElement | undefined;
    }

    declare type TypedAction<TActionModule> = {
        // tslint:disable-next-line:ban-types
        [P in keyof TActionModule]: TActionModule[P] extends Function
            ? ReturnType<TActionModule[P]>
            : never;
    }[keyof TActionModule];
}

