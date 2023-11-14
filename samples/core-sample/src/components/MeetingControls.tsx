import React from 'react';
import { useDyteSelector } from '@dytesdk/react-native-core';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import defaultIcons from '../utils/icons';

export default function MeetingControls() {
  const self = useDyteSelector(m => m.self);
  const client = useDyteSelector(m => m);
  const { audioEnabled, videoEnabled } = useDyteSelector(m => m.self);
  const toggleVideo = async () => {
    if (videoEnabled) {
      self.disableVideo();
    } else {
      await self.enableVideo();
    }
  };
  const toggleAudio = async () => {
    try {
      if (audioEnabled) {
        await self.disableAudio();
      } else {
        await self.enableAudio();
      }
    } catch (e) {
      console.log('Audio Err: ', e);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      backgroundColor: '#080808',
    },
    text: {
      color: 'white',
      fontSize: 16,
    },
    iconStyle: {
      height: 56,
      width: 56,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    disabledVideoStyle: {
      marginLeft: 8,
      fontSize: 11,
      marginTop: 10,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={'#333333'}
          onPress={toggleAudio}
          style={styles.iconStyle}>
          {audioEnabled ? (
            <SvgXml
              xml={defaultIcons.mic_on.replace('currentColor', '#FFFFFF')}
              width={25}
              height={25}
            />
          ) : (
            <SvgXml
              xml={defaultIcons.mic_off.replace('currentColor', '#FF2D2D')}
              width={25}
              height={25}
            />
          )}
        </TouchableHighlight>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={'#333333'}
          onPress={toggleVideo}
          style={styles.iconStyle}>
          {videoEnabled ? (
            <SvgXml
              xml={defaultIcons.video_on.replace('currentColor', '#FFFFFF')}
              width={25}
              height={25}
            />
          ) : (
            <SvgXml
              xml={defaultIcons.video_off.replace('currentColor', '#FF2D2D')}
              width={25}
              height={25}
            />
          )}
        </TouchableHighlight>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={'#333333'}
          onPress={() => client.leaveRoom()}
          style={styles.iconStyle}>
          <SvgXml
            xml={defaultIcons.call_end.replace('currentColor', '#FF2D2D')}
            width={30}
            height={30}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
}
