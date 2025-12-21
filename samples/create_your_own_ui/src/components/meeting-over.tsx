import React from 'react';
import {RtkEndedScreen} from '@cloudflare/realtimekit-react-native-ui';
import {UIConfig} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

function MeetingOver({
  meeting,
  config,
  states,
}: {
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return (
    <View className="flex w-full h-full">
      <RtkEndedScreen meeting={meeting} config={config} states={states} />
    </View>
  );
}

export default MeetingOver;
