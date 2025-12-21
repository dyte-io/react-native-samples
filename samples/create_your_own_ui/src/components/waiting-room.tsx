import React from 'react';
import {RtkWaitingScreen, useLanguage} from '@cloudflare/realtimekit-react-native-ui';
import {UIConfig} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

function WaitingRoom({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  meeting,
  config,
}: {
  meeting: RealtimeKitClient;
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
      <RtkWaitingScreen config={config} t={t} />
    </View>
  );
}

export default WaitingRoom;
