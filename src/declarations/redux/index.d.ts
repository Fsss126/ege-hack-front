import {Dispatch} from "redux";
import {Action} from "../../store/actions";

declare module 'redux' {
    interface Dispatch<A extends Action = Action> {
        <T extends A>(action: T): T;
    }
}
