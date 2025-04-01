import React, { useEffect, useRef, useState } from 'react';
import { useDyteSelector } from '@dytesdk/react-native-core';
import { DyteUIProvider, DyteSpinner } from '@dytesdk/react-native-ui-kit';
import MeetingHeader from '../components/MeetingHeader';
import DyteClient from '@dytesdk/web-core';
import Grid from '../components/Grid';
import ControlBar from '../components/ControlBar';
import { Animated, View } from 'react-native';

type MeetingProps = {
  meeting: DyteClient;
  meetStates: { states: any; setStates: any };
};
export default function Meeting({ meeting, meetStates }: MeetingProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { roomJoined } = useDyteSelector(m => m.self);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const toggleVisibility = () => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 0 : 1, // Fade out when visible, fade in when hidden
      duration: 300, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      setIsVisible(!isVisible); // Toggle visibility after animation completes
    });
  };
  useEffect(() => {
    meeting.join();
    const leaveHandler = () => {
      meetStates.setStates({
        ...meetStates.states,
        callState: 'ended',
      });
    };
    meeting.self.addListener('roomLeft', leaveHandler);
    return () => {
      meeting.leave();
      meeting.self.removeListener('roomLeft', leaveHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DyteUIProvider>
      <>
        {roomJoined ? (
          <View className="flex-1">
            {/* Overlay Components */}
            {isVisible && (
              <Animated.View
                style={{ opacity: fadeAnim }}
                className="absolute top-0 left-0 right-0 z-10">
                <MeetingHeader
                  meeting={meeting}
                  userName={meeting?.self?.name ?? 'Adam'}
                  userSubtitle={'FaceTime Call'}
                />
                <ControlBar meeting={meeting} />
              </Animated.View>
            )}
            {/* Full-Screen Component */}
            <View className="flex-1">
              <Grid meeting={meeting} onTap={toggleVisibility} />
            </View>
          </View>
        ) : (
          <View className="flex-1 flex-row justify-center align-center">
            <DyteSpinner />
          </View>
        )}
      </>
    </DyteUIProvider>
  );
}
