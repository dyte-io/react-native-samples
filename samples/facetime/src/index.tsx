import React, { useState } from 'react';
import Contacts from './screens/Contacts';
import Meeting from './screens/Meeting';
import DyteClient from '@dytesdk/web-core';
import { DyteProvider } from '@dytesdk/react-native-core';

type States = {
  callState: string;
  call: DyteClient;
};

export default function DyteFacetime() {
  const initialState: States = {
    callState: 'ended',
    call: {} as any,
  };

  const [states, setStates] = useState(initialState);

  if (states.callState === 'ended') {
    return <Contacts meetStates={{ states, setStates }} />;
  } else {
    return (
      <DyteProvider value={states.call}>
        <Meeting meeting={states.call} meetStates={{ states, setStates }} />
      </DyteProvider>
    );
  }
}
