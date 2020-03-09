import {AxiosInstance} from "axios";
import {Includes, InsertAfterEach} from "definitions/mixins";
import React, {Component} from "react";

declare global {
    declare interface Window {
        VK: any;
        APIRequest: AxiosInstance;
    }

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
}

