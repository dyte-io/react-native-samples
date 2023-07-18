/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useDyteClient, DyteProvider} from '@dytesdk/react-native-core';
import {DyteMeeting} from '@dytesdk/react-native-ui-kit';
import {useSelector} from 'react-redux';

export default function Meeting({
  authToken,
  roomName,
  onEnded,
}: {
  authToken: string;
  roomName: any;
  onEnded: any;
}) {
  const [client, initClient] = useDyteClient();
  const _authToken = authToken;
  const _roomName = roomName;
  const {colors} = useSelector(
    (state: any) => state.DyteDesign.states.designSystem,
  );
  React.useEffect(() => {
    const load = async () => {
      if (roomName) {
        await initClient({
          roomName: _roomName,
          authToken: _authToken,
          defaults: {
            audio: true,
            video: true,
          },
        });
      } else {
        await initClient({
          authToken: _authToken,
          defaults: {
            audio: true,
            video: true,
          },
        });
      }
    };
    load();
  }, []);
  React.useEffect(() => {
    client?.self.addListener('roomLeft', () => onEnded());
    () => {
      client?.self.removeListener('roomLeft', () => onEnded());
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
  if (client) {
    console.log(client.self.mediaPermissions);
  }
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
          }}>
          Loading
        </Text>
        <ActivityIndicator
          color={
            colors.background === '#FFFCF8' || colors.background === '#FFFFFF'
              ? colors.videoBg
              : colors.text
          }
        />
      </View>
    );
  } else if (
    client &&
    client.meta.viewType === 'GROUP_CALL' &&
    (client.self.mediaPermissions.audio !== 'ACCEPTED' ||
      client.self.mediaPermissions.video !== 'ACCEPTED')
  ) {
    return (
      <View style={styles.loadingScreen}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{marginRight: 10, color: 'white'}}>
          Waiting for Permissions
        </Text>
        <ActivityIndicator
          color={
            colors.background === '#FFFCF8' || colors.background === '#FFFFFF'
              ? colors.videoBg
              : colors.text
          }
        />
      </View>
    );
  }
  return (
    <DyteProvider value={client}>
      <DyteMeeting meeting={client} applyDesignSystem={false} />
    </DyteProvider>
  );
}
