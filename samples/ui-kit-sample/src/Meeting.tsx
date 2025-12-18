/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  useRealtimeKitClient,
  RealtimeKitProvider,
} from '@cloudflare/realtimekit-react-native';
import { RtkMeeting } from '@cloudflare/realtimekit-react-native-ui';
import { LeaveRoomState } from '@cloudflare/realtimekit';

export default function Meeting({
  authToken,
  defaults,
  onEnded = () => {},
  colors,
}: {
  authToken: string;
  defaults: any;
  colors: any;
  onEnded: any;
}) {
  const [client, initClient] = useRealtimeKitClient();
  const _authToken = authToken;
  React.useEffect(() => {
    const load = async () => {
      try {
        await initClient({
          authToken: _authToken,
          defaults: defaults,
        });
      } catch (error) {
        Alert.alert('Failed to join meeting', 'Reason: \n' + error, [
          { text: 'OK', onPress: () => onEnded() },
        ]);
      }
    };
    load();
  }, [_authToken]);
  React.useEffect(() => {
    const roomLeftHandler = ({ state }: { state: LeaveRoomState }) => {
      if (state === 'ended' || state === 'left') {
        onEnded();
      }
    };
    client?.self.addListener('roomLeft', roomLeftHandler);
    return () => {
      client?.self.removeListener('roomLeft', roomLeftHandler);
    };
  }, [client]);
  const styles = StyleSheet.create({
    loadingScreen: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0000',
    },
  });
  if (!client) {
    return (
      <View style={styles.loadingScreen}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginRight: 10,
            color:
              colors.background === '#FFFCF8' || colors.background === '#FFFFFF'
                ? colors.videoBg
                : colors.text,
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }
  return (
    <RealtimeKitProvider value={client}>
      {/* eslint-disable react-native/no-inline-styles */}
      <View style={{ flex: 1 }}>
        <RtkMeeting
          meeting={client}
          applyDesignSystem={false}
          iOSScreenshareEnabled={true}
        />
      </View>
    </RealtimeKitProvider>
  );
}
