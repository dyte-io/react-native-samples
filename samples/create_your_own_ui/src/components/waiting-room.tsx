import React from 'react';
import {DyteWaitingScreen, useLanguage} from '@dytesdk/react-native-ui-kit';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

function WaitingRoom({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  meeting,
  config,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  return (
    <View
      className="flex w-full h-full justify-center items-center"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: '#272727',
        // color: '#ffffff',
      }}>
      <DyteWaitingScreen config={config} t={t} />
    </View>
  );
}

export default WaitingRoom;
