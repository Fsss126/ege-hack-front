import {Channel, TakeableChannel} from '@redux-saga/core';
import {
  ActionPattern,
  put,
  take,
  takeLatest,
  takeLeading,
} from '@redux-saga/core/effects';
import {Action} from 'redux';
import {channel as createChannel} from 'redux-saga';

function* takePerKey<A extends Action, K>(
  pattern: ActionPattern<A> | TakeableChannel<A>,
  worker: (action: A) => any,
  selector: (action: A) => K,
  takeFunc: typeof takeLeading | typeof takeLatest,
) {
  const channelsMap = new Map<
    K extends Array<unknown> ? string : K,
    Channel<A>
  >();

  while (true) {
    const action = yield take<A>(pattern as any);
    const selectedKey = selector(action);

    const key = (selectedKey instanceof Array
      ? selectedKey.toString()
      : selectedKey) as K extends Array<unknown> ? string : K;

    let channel = channelsMap.get(key);

    if (!channel) {
      channel = createChannel();
      channelsMap.set(key, channel);
      yield takeFunc(channel, worker);
    }
    yield put(channel, action);
  }
}

export function* takeLatestPerKey<A extends Action, K>(
  pattern: ActionPattern<A> | TakeableChannel<A>,
  worker: (action: A) => any,
  selector: (action: A) => K,
) {
  yield* takePerKey<A, K>(pattern, worker, selector, takeLatest);
}

export function* takeLeadingPerKey<A extends Action, K>(
  pattern: ActionPattern<A> | TakeableChannel<A>,
  worker: (action: A) => any,
  selector: (action: A) => K,
) {
  yield* takePerKey<A, K>(pattern, worker, selector, takeLeading);
}
