/* eslint-disable react-native/no-inline-styles */
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ({
  participant,
  maxLength = 20,
  meeting,
  children,
}: {
  participant: any;
  meeting?: any;
  maxLength?: number;
  children?: ReactNode;
}) {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 4,
      backgroundColor: '#1A1A1A',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 160 + maxLength,
      overflow: 'hidden',
    },
    childStyle: {
      minWidth: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.childStyle}>{children}</View>
      {!participant && !meeting && (
        <Text style={{ color: 'white' }}>Invalid User</Text>
      )}
      {participant && !meeting && (
        <Text style={{ color: 'white' }}>{participant.name}</Text>
      )}
      {meeting && participant === meeting.self && (
        <Text style={{ color: 'white' }}>{participant.name} (you)</Text>
      )}
    </View>
  );
}
