import APIRequest from 'api';
import {AxiosError} from 'axios';
import {AccountInfo, Credentials} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';
const VK_APP_ID = process.env.REACT_APP_VK_APP_ID;

export enum AuthEventTypes {
  login = 'auth.login',
  success = 'auth.success',
  error = 'auth.error',
  logout = 'auth.logout',
}

function setCredentialsToStorage(credentials: Credentials): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    credentials ? JSON.stringify(credentials) : credentials,
  );
}

function getCredentialsFromStorage(): Maybe<Credentials> {
  try {
    const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storedString) {
      return undefined;
    }
    const credentials = JSON.parse(storedString);

    if (!credentials.access_token) {
      throw new Error(
        `Incomplete data parsed from local storage: ${storedString}`,
      );
    }
    return credentials;
  } catch (e) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    throw e;
  }
}

export type AuthLoginCallback = SimpleCallback;

export type AuthSuccessCallback = (credentials: Credentials) => void;

export type AuthErrorCallback = (error: AxiosError) => void;

export type AuthLogoutCallback = SimpleCallback;

type AuthEventHandlers = {
  [AuthEventTypes.login]?: AuthLoginCallback[];
  [AuthEventTypes.success]?: AuthSuccessCallback[];
  [AuthEventTypes.error]?: AuthErrorCallback[];
  [AuthEventTypes.logout]?: AuthLogoutCallback[];
};

class Auth {
  credentials?: Credentials;
  userInfo?: AccountInfo;
  eventHandlers: AuthEventHandlers = {};

  constructor() {
    let credentials;
    try {
      credentials = getCredentialsFromStorage();
      this.setCredentials(credentials);
    } catch (e) {
      console.error('Error retrieving credentials from local storage.');
      this.setCredentials(undefined);
    }
  }

  setCredentials(credentials: Credentials | undefined): void {
    this.credentials = credentials;
  }

  login = (redirectUrl: string): void => {
    window.location.href = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=page&redirect_uri=${redirectUrl}&response_type=code&openapi=1&scope=email`;
  };

  onLogout = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.credentials = undefined;
    this.userInfo = undefined;
    for (const handler of this.eventHandlers[AuthEventTypes.logout] || []) {
      handler();
    }
  };

  onSuccess = (credentials: Credentials): void => {
    setCredentialsToStorage(credentials);
    this.setCredentials(credentials);
    for (const handler of this.eventHandlers[AuthEventTypes.success] || []) {
      handler(credentials);
    }
  };

  onError = (e: AxiosError): void => {
    for (const handler of this.eventHandlers[AuthEventTypes.error] || []) {
      handler(e);
    }
  };

  logout = (): void => {
    if (!VK) {
      this.onLogout();
      return;
    }
    VK.init({apiId: VK_APP_ID});

    const timeout = setTimeout(this.onLogout, 500);

    VK.Auth.getLoginStatus(() => {
      VK.Auth.logout(() => {
        clearTimeout(timeout);
        this.onLogout();
      });
    });
  };

  onLogin = async (code: string, redirectUrl: string): Promise<void> => {
    try {
      const credentials: Credentials = await APIRequest.post('/login/vk', {
        code,
        redirect_uri: redirectUrl,
      });
      this.onSuccess(credentials);
    } catch (e) {
      this.onError(e);
    }
  };

  subscribe<E extends keyof AuthEventHandlers>(
    eventType: E,
    handler: ArrayElement<NonNullable<AuthEventHandlers[E]>>,
  ): void {
    ((this.eventHandlers[eventType] ||
      (this.eventHandlers[eventType] = [])) as any).push(handler);
  }

  unsubscribe<E extends keyof AuthEventHandlers>(
    eventType: E,
    handler: ArrayElement<NonNullable<AuthEventHandlers[E]>>,
  ): void {
    const {
      eventHandlers: {[eventType]: eventHandlers},
    } = this;

    if (!eventHandlers) {
      return;
    }
    this.eventHandlers[eventType] = (eventHandlers as any).filter(
      (func: AuthSuccessCallback | AuthErrorCallback | SimpleCallback) =>
        func !== handler,
    );
  }

  getAccessToken(): string {
    if (!this.credentials) {
      throw new Error('User not logged in.');
    }
    return this.credentials.access_token;
  }

  getCredentials(): Auth['credentials'] {
    return this.credentials;
  }

  getUserInfo = async (): Promise<Auth['userInfo']> => {
    if (this.userInfo) {
      return this.userInfo;
    }
    try {
      this.userInfo = await APIRequest.get('/accounts/info');
    } catch (e) {
      console.error(e);
      this.userInfo = undefined;
      return e;
    }
    return this.userInfo;
  };
}

export default new Auth();
