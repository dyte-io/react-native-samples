import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function WaitingScreen() {
  return (
    <ActivityIndicator
      color={Colors.white}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
    />
  );
}
