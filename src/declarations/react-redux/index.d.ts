import {Dispatch} from 'redux';
import {Action} from '../../store/actions';

declare module 'react-redux' {
    function useDispatch<TDispatch = Dispatch<Action>>(): TDispatch;
}
