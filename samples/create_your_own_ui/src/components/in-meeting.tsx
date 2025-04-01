import React from 'react';
import type DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import {
  DyteGrid,
  DyteNotifications,
  DyteDialogManager,
  defaultIconPack,
  useLanguage,
  UIConfig,
} from '@dytesdk/react-native-ui-kit';
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
  meeting: DyteClient;
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
        className="flex-1 justify-center items-center"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          backgroundColor: '#272727',
          // color: '#ffffff',
        }}>
        <DyteGrid meeting={meeting} config={config} states={states} />
        {/* <ActiveSpeakerGrid meeting={meeting} /> */}
        <DyteNotifications
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
        <DyteDialogManager
          meeting={meeting}
          config={config}
          states={states}
          onDyteStateUpdate={stateUpdate}
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
