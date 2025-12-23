import React from 'react';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates, SetStates} from '../types';
import {
  RtkGrid,
  RtkNotifications,
  RtkDialogManager,
  defaultIconPack,
  useLanguage,
  UIConfig,
} from '@cloudflare/realtimekit-react-native-ui';
import MeetingHeader from './meeting-header';
import MeetingControlBar from './meeting-control-bar';
import MeetingSideBar from './meeting-sidebar';
import {View} from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ActiveSpeakerGrid from './active-speaker-grid';

function InMeeting({
  meeting,
  config,
  states,
  setStates,
}: {
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const stateUpdate = (e: any) => {
    const newStateUpdate = e;
    setStates((oldState: CustomStates) => {
      return {
        ...oldState,
        ...newStateUpdate,
      };
    });
  };
  const t = useLanguage();
  return (
    <View className="flex w-full h-full">
      <View className="flex-0 flex-shrink">
        <MeetingHeader
          meeting={meeting}
          config={config}
          states={states}
          setStates={setStates}
        />
      </View>
      <View
        className="flex-1"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          backgroundColor: '#272727',
          // color: '#ffffff',
        }}>
        <RtkGrid meeting={meeting} config={config} states={states} />
        {/* <ActiveSpeakerGrid meeting={meeting} /> */}
        <RtkNotifications
          meeting={meeting}
          config={config}
          states={states}
          iconPack={defaultIconPack}
          size="sm"
          t={t}
        />
        <MeetingSideBar
          meeting={meeting}
          config={config}
          states={states}
          setStates={setStates}
        />
        <RtkDialogManager
          meeting={meeting}
          config={config}
          states={states}
          onRtkStateUpdate={stateUpdate}
        />
      </View>
      <View className="flex-0 flex-shrink">
        <MeetingControlBar
          meeting={meeting}
          config={config}
          states={states}
          setStates={setStates}
        />
      </View>
    </View>
  );
}

export default InMeeting;
