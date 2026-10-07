import {DeviceEventEmitter} from 'react-native';

export const AUTH_EXPIRED_EVENT = 'sm-associate-auth-expired';

export function notifyAuthExpired() {
  DeviceEventEmitter.emit(AUTH_EXPIRED_EVENT);
}

export function onAuthExpired(listener) {
  const subscription = DeviceEventEmitter.addListener(AUTH_EXPIRED_EVENT, listener);
  return () => subscription.remove();
}
