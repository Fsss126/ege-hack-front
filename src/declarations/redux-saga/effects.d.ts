import {Action} from 'store/actions';
import {ActionPattern, PutEffect, TakeEffect, take, put} from 'redux-saga/effects';

declare module 'effects' {

    function take<A extends Action>(pattern?: ActionPattern<A>): TakeEffect;

    function put<A extends Action>(action: A): PutEffect<A>
}
