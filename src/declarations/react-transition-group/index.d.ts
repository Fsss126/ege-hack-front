import {Component} from "react";
import {CSSTransitionProps} from "react-transition-group/CSSTransition";

declare module 'react-transition-group' {
    class CSSTransition extends Component<CSSTransitionProps> {
        appliedClasses: any;
        addClass(node: any, type: any, phase: any): void;
    }
}
