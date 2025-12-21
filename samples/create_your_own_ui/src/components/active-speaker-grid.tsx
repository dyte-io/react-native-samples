import React, {useEffect, useState} from 'react';
import type RealtimeKitClient from '@cloudflare/realtimekit';
import {RtkParticipantTile} from '@cloudflare/realtimekit-react-native-ui';
import {Dimensions, View} from 'react-native';
import {useRealtimeKitSelector} from '@cloudflare/realtimekit-react-native';
import { type RTKParticipant, type RTKSelf } from '@cloudflare/realtimekit';

type Peer = RTKParticipant | RTKSelf;

function ActiveSpeakerGrid({meeting}: {meeting: RealtimeKitClient}) {
  const [currentParticipant, setParticipant] = useState<Peer>(meeting.self);
  const otherParticipants = useRealtimeKitSelector(m =>
    m.participants.joined.toArray(),
  );
  const dimensions = Dimensions.get('window');
  useEffect(() => {
    const handleActiveSpeaker = (participant: any) => {
      // console.log(`${participant.peerId} is currently speaking`);
      const active =
        meeting
          .participants!.joined.toArray()
          .find(p => p.id === participant.peerId) ?? meeting.self;
      if (active) {
        // console.log('Set current: ', active);
        setParticipant(active);
      }
    };
    meeting.participants.on('activeSpeaker', handleActiveSpeaker);
    return () => {
      meeting.participants.off('activeSpeaker', handleActiveSpeaker);
    };
  }, [meeting]);
  return (
    <View className="flex justify-center items-center h-screen">
      <View className="flex justify-center items-center">
        <RtkParticipantTile
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
            <RtkParticipantTile
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
          <RtkParticipantTile
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
