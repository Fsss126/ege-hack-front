import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import elementClosest from 'element-closest';

elementClosest(window);

//IE doesn't support event constructor
(function () {
  if (typeof window.CustomEvent === 'function') {
    return false;
  } //If not IE

  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail,
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
