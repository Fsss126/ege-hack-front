import React from 'react';

// looked at https://github.com/TypeStrong/ts-node/issues/715
declare module 'react-custom-scrollbars' {
    declare interface Scrollbars {
        view: HTMLDivElement;
    }
}
