/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import ParticipantTile from '../components/ParticipantTile';
import { useRealtimeKitSelector } from '@cloudflare/realtimekit-react-native';
import MeetingControls from '../components/MeetingControls';
import MeetingDetails from '../components/MeetingDetails';

export default function MeetingScreen({ meeting }: { meeting: any }) {
  const activeParticipants = useRealtimeKitSelector(m => m.participants.active);

  // Access Plugins
  const plugins = useRealtimeKitSelector(m => m.plugins);
  // Access Chat messages
  const chat = useRealtimeKitSelector(m => m.chat);
  // Access Polls
  const polls = useRealtimeKitSelector(m => m.polls);

  const viewMode = meeting.participants.viewMode;
  const currentPage = meeting.participants.currentPage;
  const maxParticipantsPerPage = 6;
  const calcPeerWidth = (
    dimensions: { width: number; height: number },
    numParticipants: number,
    _viewMode: string,
  ) => {
    // console.log('Peer Height: ', dimensions.height);
    const numPeers = numParticipants + (_viewMode === 'ACTIVE_GRID' ? 1 : 0);
    if (numPeers < 4) {
      const height = dimensions.height / numPeers;
      const width = Math.floor(height / 0.5625);
      return (dimensions.width > width ? width : dimensions.width) - 6;
    } else {
      const width = Math.floor(dimensions.width / 2);
      return width - 4;
    }
  };
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const peerWidth = calcPeerWidth(
    dimensions,
    activeParticipants.size,
    viewMode,
  );
  return (
    <View style={{ flex: 1 }}>
      <MeetingDetails />
      <View
        onLayout={event =>
          setDimensions({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
        style={{
          flex: 1,
          overflow: 'scroll',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {viewMode === 'PAGINATED' && (
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {activeParticipants
                .toArray()
                .slice(
                  (currentPage - 1) * maxParticipantsPerPage,
                  currentPage * maxParticipantsPerPage,
                )
                .map(p => (
                  <ParticipantTile
                    participant={p}
                    style={{ width: peerWidth }}
                  />
                ))}
              <ParticipantTile
                participant={meeting.self}
                meeting={meeting}
                style={{ width: peerWidth }}
              />
            </ScrollView>
          )}
          {viewMode === 'ACTIVE_GRID' && (
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {activeParticipants.toArray().map(p => (
                <ParticipantTile participant={p} style={{ width: peerWidth }} />
              ))}
              <ParticipantTile
                participant={meeting.self}
                meeting={meeting}
                style={{ width: peerWidth }}
              />
            </ScrollView>
          )}
        </View>
      </View>
      <MeetingControls />
    </View>
  );
}

MeetingScreen.defaultProps = {
  height: 0,
};
