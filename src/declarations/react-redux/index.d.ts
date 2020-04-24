import {Dispatch} from "../global";
import {useDispatch} from "react-redux";

declare module 'react-redux' {
    function useDispatch<TDispatch = Dispatch>(): TDispatch;
}
