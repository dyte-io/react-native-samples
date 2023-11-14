/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useDyteClient, DyteProvider } from '@dytesdk/react-native-core';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MeetingScreen from './Screens/MeetingScreen';

export default function App() {
  const [client, initClient] = useDyteClient();
  const [roomJoined, setRoomJoined] = useState(false);
  const meetingOptions = {
    audio: true,
    video: true,
  };
  // Specify roomName if you're using v1 meeetings
  // For v2 meetings, just the authToken is required
  React.useEffect(() => {
    const load = async () => {
      await initClient({
        // roomName: 'YOUR_ROOM_NAME',
        authToken: 'YOUR_AUTH_TOKEN',
        defaults: meetingOptions,
      });
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!client?.self.roomJoined) {
      client?.joinRoom();
    }
    client?.self.addListener('roomJoined', () => setRoomJoined(true));
    client?.self.addListener('roomLeft', () => setRoomJoined(false));
    () => {
      client?.self.removeListener('roomJoined', () => setRoomJoined(true));
      client?.self.removeListener('roomLeft', () => setRoomJoined(false));
    };
  }, [client, roomJoined]);

  if (!client || !roomJoined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <DyteProvider value={client}>
          <MeetingScreen meeting={client} />
        </DyteProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
