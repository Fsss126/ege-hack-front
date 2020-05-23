import {TakeableChannel} from '@redux-saga/core';
import {EUserAction} from 'modules/user/user.constants';
import {actionChannel, ActionPattern, spawn, take} from 'redux-saga/effects';
import {Action} from 'store/actions';

export function* waitForLogin<A extends Action = Action>(
  pattern: ActionPattern<A>,
  saga: (channel: TakeableChannel<A>) => Generator,
) {
  const channel = yield actionChannel(pattern);
  yield take([EUserAction.LOG_IN, EUserAction.LOG_IN_SUCCESS]);
  yield spawn(saga, channel);
}
