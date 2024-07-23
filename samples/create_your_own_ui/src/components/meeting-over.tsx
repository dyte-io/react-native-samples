import React from 'react';
import {DyteEndedScreen} from '@dytesdk/react-native-ui-kit';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

function MeetingOver({
  meeting,
  config,
  states,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return (
    <View className="flex w-full h-full">
      <DyteEndedScreen meeting={meeting} config={config} states={states} />
    </View>
  );
}

export default MeetingOver;
