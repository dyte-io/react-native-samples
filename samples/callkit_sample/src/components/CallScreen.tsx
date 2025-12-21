import React, {useContext, useEffect} from 'react';
import {useRealtimeKitSelector} from '@cloudflare/realtimekit-react-native';
import {
  RtkGrid,
  RtkControlbar,
  RtkDialogManager,
  RtkUIContext,
} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import WaitingScreen from './WaitingScreen';

export default function CallScreen({
  meeting,
  onEnd,
}: {
  meeting: RealtimeKitClient;
  onEnd: () => void;
}) {
  const {storeStates} = useContext(RtkUIContext);
  const {roomJoined} = useRealtimeKitSelector(m => m.self);
  useEffect(() => {
    meeting.self.addListener('roomLeft', () => onEnd());
    meeting.join();
    return () => {
      meeting.self.removeListener('roomLeft', () => onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!roomJoined || !meeting) {
    return <WaitingScreen />;
  }
  return (
    <>
      <RtkDialogManager meeting={meeting} states={storeStates} />
      <RtkGrid meeting={meeting} aspectRatio={'4:3'} />
      <RtkControlbar meeting={meeting} />
    </>
  );
}
