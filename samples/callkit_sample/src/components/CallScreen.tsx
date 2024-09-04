import React, {useContext, useEffect} from 'react';
import {useDyteSelector} from '@dytesdk/react-native-core';
import {
  DyteGrid,
  DyteControlbar,
  DyteDialogManager,
  DyteUIContext,
} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import WaitingScreen from './WaitingScreen';

export default function CallScreen({
  meeting,
  onEnd,
}: {
  meeting: DyteClient;
  onEnd: () => void;
}) {
  const {storeStates} = useContext(DyteUIContext);
  const {roomJoined} = useDyteSelector(m => m.self);
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
      <DyteDialogManager meeting={meeting} states={storeStates} />
      <DyteGrid meeting={meeting} aspectRatio={'4:3'} />
      <DyteControlbar meeting={meeting} />
    </>
  );
}
