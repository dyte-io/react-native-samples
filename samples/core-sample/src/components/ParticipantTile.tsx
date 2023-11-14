import React, { useState } from 'react';
import { Dimensions, StyleProp, StyleSheet, View } from 'react-native';
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core';
import { useDyteSelector } from '@dytesdk/react-native-core';
import PeerView from './PeerView';
import DyteNameTag from './NameTag';
import { SvgXml } from 'react-native-svg';
import defaultIcons from '../utils/icons';

export default function ({
  participant,
  meeting,
  style,
  iconPack = defaultIcons,
}: {
  participant: DyteParticipant | DyteSelf;
  config?: any;
  meeting?: any;
  style?: StyleProp<any>;
  iconPack?: any;
}) {
  const self = useDyteSelector(m => m.self);
  const isSelf = participant.id === self.id;
  participant = useDyteSelector(
    m =>
      m.participants.joined.toArray().filter(p => p.id === participant.id)[0],
  );
  const pCount = useDyteSelector(m => m.participants.active.toArray().length);
  if (!participant && isSelf) {
    participant = self;
  }
  if (!participant) {
    return null;
  }
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  });
  const styles = StyleSheet.create({
    container: {
      margin: 5,
    },
    nameTagContainer: {
      position: 'absolute',
    },
    bottomLeftContainer: {
      position: 'absolute',
      bottom: 10,
      left: 10,
    },
    bottomCenterContainer: {
      position: 'absolute',
      bottom: 10,
      marginHorizontal: '30%',
    },
    bottomRightContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    topLeftContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    topCenterContainer: {
      position: 'absolute',
      top: 10,
      marginHorizontal: '30%',
    },
    topRightContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    iconStyle: {
      padding: 4,
      backgroundColor: '#1A1A1A',
    },
  });
  const heightRatio = dimensions.width / Dimensions.get('screen').height;
  return (
    <View
      style={styles.container}
      onLayout={event => {
        setDimensions({
          width:
            event.nativeEvent.layout.width !== 0
              ? event.nativeEvent.layout.width
              : dimensions.width,
          height:
            event.nativeEvent.layout.height !== 0
              ? event.nativeEvent.layout.height
              : dimensions.height,
        });
      }}>
      <PeerView
        participant={participant ?? meeting}
        width={
          style !== undefined
            ? Object.keys(style).length !== 0
              ? style.width
              : dimensions.width * 0.9
            : dimensions.width * 0.9
        }
        height={
          pCount < 2
            ? style.width * (3 / 4)
            : heightRatio < 0.4
            ? heightRatio < 0.3 && pCount < 4
              ? style.width * (4 / 3)
              : style.width
            : undefined
        }
      />
      {participant.isPinned && (
        <View style={styles.topLeftContainer}>
          <View style={styles.iconStyle}>
            <SvgXml
              xml={iconPack.pin.replace('currentColor', '#FFFFFF')}
              width={20}
              height={20}
            />
          </View>
        </View>
      )}
      <View style={styles.bottomLeftContainer}>
        {!meeting ? (
          <DyteNameTag participant={participant}>
            {participant.audioEnabled ? (
              <View style={styles.iconStyle}>
                <SvgXml
                  xml={iconPack.mic_on.replace('currentColor', '#FFFFFF')}
                  width={16}
                  height={16}
                />
              </View>
            ) : (
              /* <DyteAudioVisualizer participant={participant} />*/
              <View style={styles.iconStyle}>
                <SvgXml
                  xml={iconPack.mic_off.replace('currentColor', '#FF2D2D')}
                  width={16}
                  height={16}
                />
              </View>
            )}
          </DyteNameTag>
        ) : (
          <DyteNameTag participant={self} meeting={meeting}>
            {self.audioEnabled ? (
              <View style={styles.iconStyle}>
                <SvgXml
                  xml={iconPack.mic_on.replace('currentColor', '#FFFFFF')}
                  width={16}
                  height={16}
                />
              </View>
            ) : (
              <View style={styles.iconStyle}>
                <SvgXml
                  xml={iconPack.mic_off.replace('currentColor', '#FF2D2D')}
                  width={16}
                  height={16}
                />
              </View>
            )}
          </DyteNameTag>
        )}
      </View>
    </View>
  );
}
