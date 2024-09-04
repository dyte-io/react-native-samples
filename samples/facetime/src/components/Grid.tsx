import {
  DyteDialogManager,
  DyteParticipantTile,
  DyteSimpleGrid,
  DyteUIContext,
} from '@dytesdk/react-native-ui-kit';
import React, { useContext, useRef } from 'react';
import {
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DyteClient from '@dytesdk/web-core';
import { useDyteSelector } from '@dytesdk/react-native-core';

const Grid = ({
  meeting,
  onTap,
}: {
  meeting: DyteClient;
  onTap: () => void;
}) => {
  const { storeStates } = useContext(DyteUIContext);
  const pan = useRef(new Animated.ValueXY()).current;
  const participants = useDyteSelector(m => m.participants.active);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderGrant: () => {
        // Capture the offset of the current position
        pan.extractOffset();
      },
      onPanResponderRelease: () => {
        // Flatten the offset so the current position becomes the starting point
        pan.flattenOffset();
      },
    }),
  ).current;
  if (participants.toArray().length === 0) {
    return (
      <>
        <DyteDialogManager meeting={meeting} states={storeStates} />
        <DyteParticipantTile
          meeting={meeting}
          participant={meeting.self}
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height * 0.9,
          }}
        />
      </>
    );
  }
  return (
    <>
      <DyteDialogManager meeting={meeting} states={storeStates} />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onTap()}
        className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <DyteSimpleGrid
          meeting={meeting}
          participants={participants.toArray()}
        />
      </TouchableOpacity>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingComponent,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            transform: pan.getTranslateTransform(),
            zIndex: 20,
          },
        ]}>
        <DyteParticipantTile
          meeting={meeting}
          participant={meeting.self}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 150,
            height: 200,
          }}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  floatingComponent: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 150,
    height: 200,
  },
  innerComponent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 150, 136, 1)', // Example inner content
  },
});

export default Grid;
