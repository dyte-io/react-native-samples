import {
  DyteCameraToggle,
  DyteLeaveButton,
  DyteMicToggle,
  DyteSettingsToggle,
} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import React from 'react';
import { View } from 'react-native';

export default function ControlBar({ meeting }: { meeting: DyteClient }) {
  return (
    <View className="flex-row justify-evenly border-transparent items-center">
      <DyteCameraToggle meeting={meeting} />
      <DyteMicToggle meeting={meeting} />
      <DyteSettingsToggle />
      <DyteLeaveButton />
    </View>
  );
}
