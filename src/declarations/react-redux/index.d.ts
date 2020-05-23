import {Dispatch} from 'redux';
import {Action} from 'store/actions';
import {AppState} from 'store/reducers';

declare module 'react-redux' {
    function useDispatch<TDispatch = Dispatch<Action>>(): TDispatch;

    function useSelector<TState = AppState, TSelected = unknown>(
      selector: (state: TState) => TSelected,
      equalityFn?: (left: TSelected, right: TSelected) => boolean
    ): TSelected;
}
