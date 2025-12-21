import {
  RtkCameraToggle,
  RtkLeaveButton,
  RtkMicToggle,
  RtkSettingsToggle,
} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import React from 'react';
import { View } from 'react-native';

export default function ControlBar({ meeting }: { meeting: RealtimeKitClient }) {
  return (
    <View className="flex-row justify-evenly border-transparent items-center">
      <RtkCameraToggle meeting={meeting} />
      <RtkMicToggle meeting={meeting} />
      <RtkSettingsToggle />
      <RtkLeaveButton />
    </View>
  );
}
