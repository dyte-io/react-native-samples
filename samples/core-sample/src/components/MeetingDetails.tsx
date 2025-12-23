import React from 'react';
import { useRealtimeKitSelector } from '@cloudflare/realtimekit-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function MeetingDetails() {
  const title = useRealtimeKitSelector(m => m.meta.meetingTitle);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}
