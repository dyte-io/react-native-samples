import React, { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-native-core';
import { DyteUIProvider, DyteMeeting } from '@dytesdk/react-native-ui-kit';
import token from './token.json';
import { Text } from 'react-native';

export default function App() {
  const [meeting, initMeeting] = useDyteClient();
  useEffect(() => {
    const init = async () => {
      initMeeting({
        authToken: token.authToken,
        defaults: {
          audio: true,
          video: true,
        },
      });
    };
    init();
  }, [initMeeting]);

  if (!meeting) {
    return <Text>Meeting not initialized</Text>;
  }
  return (
    <DyteProvider value={meeting}>
      <DyteUIProvider>
        <DyteMeeting meeting={meeting} />
      </DyteUIProvider>
    </DyteProvider>
  );
}
