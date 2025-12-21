import React, { useState } from 'react';
import Contacts from './screens/Contacts';
import Meeting from './screens/Meeting';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { RealtimeKitProvider } from '@cloudflare/realtimekit-react-native';

type States = {
  callState: string;
  call: RealtimeKitClient;
};

export default function RtkFacetime() {
  const initialState: States = {
    callState: 'ended',
    call: {} as any,
  };

  const [states, setStates] = useState(initialState);

  if (states.callState === 'ended') {
    return <Contacts meetStates={{ states, setStates }} />;
  } else {
    return (
      <RealtimeKitProvider value={states.call}>
        <Meeting meeting={states.call} meetStates={{ states, setStates }} />
      </RealtimeKitProvider>
    );
  }
}
