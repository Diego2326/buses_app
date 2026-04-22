/* eslint-env jest */

const mockAsyncStorage = {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-camera', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    CameraView: props => React.createElement(View, props),
    useCameraPermissions: () => [{granted: false}, jest.fn()],
  };
});
