import React from "react";
import {ScrollbarProps} from "react-custom-scrollbars";
import "react-custom-scrollbars";

//TODO: learn why the fuck TS is failing to pickup the defined properties

// looked at https://github.com/TypeStrong/ts-node/issues/715
declare module "react-custom-scrollbars" {
    export class Scrollbars extends React.Component<ScrollbarProps> {
        view: React.ElementType<JSX.IntrinsicElements['div']>;
    }
}
