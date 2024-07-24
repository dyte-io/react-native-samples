import React, {useEffect, useState} from 'react';
import type DyteClient from '@dytesdk/web-core';
import {DyteParticipantTile} from '@dytesdk/react-native-ui-kit';
import {Peer} from '@dytesdk/react-native-ui-kit/lib/typescript/types/dyte-client';
import {Dimensions, View} from 'react-native';
import {useDyteSelector} from '@dytesdk/react-native-core';

function ActiveSpeakerGrid({meeting}: {meeting: DyteClient}) {
  const [currentParticipant, setParticipant] = useState<Peer>(meeting.self);
  const otherParticipants = useDyteSelector(m =>
    m.participants.joined.toArray(),
  );
  const dimensions = Dimensions.get('window');
  useEffect(() => {
    const handleActiveSpeaker = (participant: any) => {
      console.log(`${participant.peerId} is currently speaking`);
      const active =
        meeting
          .participants!.joined.toArray()
          .find(p => p.id === participant.peerId) ?? meeting.self;
      if (active) {
        console.log('Set current: ', active);
        setParticipant(active);
      }
    };
    meeting.participants.on('activeSpeaker', handleActiveSpeaker);
    return () => {
      meeting.participants.off('activeSpeaker', handleActiveSpeaker);
    };
  }, [meeting]);
  // console.log('Current: ', currentParticipant);
  return (
    <View className="flex justify-center items-center h-screen">
      <View className="flex justify-center items-center">
        <DyteParticipantTile
          meeting={meeting}
          participant={currentParticipant}
          style={{
            height: dimensions.height * 0.6,
            width: dimensions.width * 0.9,
          }}
        />
      </View>
      <View
        className="absolute flex flex-col items-end p-2"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{bottom: 100, right: 0}}>
        {otherParticipants.length > 0 &&
          otherParticipants.map((p, index) => (
            <DyteParticipantTile
              key={index}
              meeting={meeting}
              participant={p}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                height: 150,
                width: 150,
              }}
            />
          ))}
        {currentParticipant !== meeting.self && (
          <DyteParticipantTile
            meeting={meeting}
            participant={meeting.self}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: 150,
              width: 150,
            }}
          />
        )}
      </View>
    </View>
  );
}

export default ActiveSpeakerGrid;
