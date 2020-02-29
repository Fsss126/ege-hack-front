import React from "react";
import {AxiosInstance} from "axios";
import {Includes, InsertAfterEach} from "../definitions/mixins";
import {FunctionComponent} from "react";

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
        interface LoDashStatic {
            insertAfterEach: InsertAfterEach;
            includes: Includes;
        }
    }

    declare namespace React {
        type withDefaultProps<T extends React.FunctionComponent<infer P> | React.ComponentClass<infer P> | ForwardRefExoticComponent<infer P>> = T & Required<Pick<T, 'defaultProps'>>;
    }

    declare namespace ReactCustomScrollbars {
        class Scrollbars {
            view: React.ElementType<JSX.IntrinsicElements['div']>
        }
    }
}
