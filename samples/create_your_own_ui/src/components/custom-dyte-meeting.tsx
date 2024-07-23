import React from 'react';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import InMeeting from './in-meeting';
import MeetingLoading from './meeting-loading';
import MeetingOver from './meeting-over';
import SetupScreen from './setup-screen';
import WaitingRoom from './waiting-room';

function CustomDyteMeeting({
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
  if (!meeting) {
    <MeetingLoading />;
  }

  if (states.meeting === 'setup') {
    return (
      <SetupScreen
        meeting={meeting}
        config={config}
        states={states}
        setStates={setStates}
      />
    );
  }

  if (states.meeting === 'ended') {
    return (
      <MeetingOver
        meeting={meeting}
        config={config}
        states={states}
        setStates={setStates}
      />
    );
  }

  if (states.meeting === 'waiting') {
    console.log('Waiting...');
    return (
      <WaitingRoom
        meeting={meeting}
        config={config}
        states={states}
        setStates={setStates}
      />
    );
  }

  if (states.meeting === 'joined') {
    console.log('Joined...');
    return (
      <InMeeting
        meeting={meeting}
        config={config}
        states={states}
        setStates={setStates}
      />
    );
  }
}

export default CustomDyteMeeting;
