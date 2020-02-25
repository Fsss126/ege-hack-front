export enum ActionType {
    LOG_IN_SUCCESS = 'LOG_IN_SUCCESS',
    LOG_IN_ERROR = 'LOG_IN_ERROR',
    LOG_OUT = 'LOG_OUT',
    FETCH_USER_INFO = 'FETCH_USER_INFO',
    USER_INFO_SUCCESS = 'USER_INFO_SUCCESS',
    USER_INFO_ERROR = 'USER_INFO_ERROR'
}

interface Credentials {
    access_token: string;
    refresh_token: string;
}

export type Action = { type: ActionType } & (
    | { type: ActionType.LOG_IN_SUCCESS; credentials: Credentials}
    | { type: ActionType.LOG_IN_ERROR }
    | { type: ActionType.LOG_OUT }
    | { type: ActionType.FETCH_USER_INFO }
    | { type: ActionType.USER_INFO_SUCCESS }
    );
