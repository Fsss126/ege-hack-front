import MobileDetect from 'mobile-detect';

import {APP_BASE_URL} from './constants';

export const daysBetween = (date1: Date, date2: Date): number => {
  const one_day = 1000 * 60 * 60 * 24;
  const date1_ms = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
  ).getTime();
  const date2_ms = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
  ).getTime();
  const difference_ms = date2_ms - date1_ms;

  return Math.floor(difference_ms / one_day);
};

export const renderDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string | string[] = 'ru',
) => date.toLocaleString(locale, options);
renderDate.date = {
  day: 'numeric',
  month: 'long',
};
renderDate.dateWithYear = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};
renderDate.dateWithHour = {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
};
renderDate.shortDate = {
  day: 'numeric',
  month: 'numeric',
};
renderDate.time = {
  hour: '2-digit',
  minute: '2-digit',
};

export const getAuthHeader = (username: string, password: string): object => ({
  Authorization: `Basic ${btoa(username + ':' + password)}`,
});

export const trimFileExtension = (filename: string): string =>
  filename.replace(/\.[^/.]+$/, '');

export const getFileExtension = (filename: string): string => {
  const filenameParts = filename.split('.');

  if (filenameParts.length < 2) {
    return '';
  }
  return `.${filenameParts.pop()}`;
};

export const downloadFile = async (
  url: string,
  name: string,
): Promise<void> => {
  console.log(url, name);
  // IE10+ : (has Blob, but not a[download] or URL)
  if (navigator.msSaveBlob) {
    const blob = await fetch(url).then((r) => r.blob());
    navigator.msSaveBlob(blob, name);
  } else {
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    // link.target = '_blank';
    const event = new MouseEvent('click');
    link.dispatchEvent(event);
  }
};

export const deviceInfo = new MobileDetect(window.navigator.userAgent);

export const renderPrice = (price: number): string => {
  const isIphone = deviceInfo.os() === 'iOS';

  return `${price}${isIphone ? ' руб.' : '₽'}`;
};

export const getCurrentUrl = (): string =>
  `${window.location.origin}${window.location.pathname}`;

export const getAppUrl = (path: string): string =>
  `${window.location.origin}${APP_BASE_URL}${path}`;

export const assignRef = <T>(forwardedRef: React.Ref<T>, ref: T): void => {
  if (forwardedRef) {
    if ('current' in forwardedRef) {
      (forwardedRef as any).current = ref;
    } else if (typeof forwardedRef === 'function') {
      forwardedRef(ref);
    }
  }
};
