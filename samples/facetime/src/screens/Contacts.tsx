import React from 'react';
import { useEffect, useState } from 'react';
import MeetingTile from '../components/MeetingTile';
import creds from '../creds';
import { ScrollView, Text } from 'react-native';
import { useDyteClient } from '@dytesdk/react-native-core';
import token from '../token.json';

export default function Meetings({
  meetStates,
}: {
  meetStates: { states: any; setStates: any };
}) {
  const [apiMeetings, setAPIMeetings] = useState<[]>();
  const [meeting, initMeeting] = useDyteClient();
  useEffect(() => {
    const getMeetings = async () => {
      const Buffer = require('buffer').Buffer;
      const ORG_ID = creds.ORG_ID;
      const API_KEY = creds.API_KEY;
      const base64EncodedString = Buffer.from(`${ORG_ID}:${API_KEY}`).toString(
        'base64',
      );
      const resp = await fetch('https://api.dyte.io/v2/meetings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64EncodedString}`,
        },
      });

      if (!resp.ok) {
        // Handle non-2xx HTTP responses
        console.error('Failed to fetch meetings:', resp.statusText);
        return;
      }

      const getMeetingsResp = await resp.json();
      setAPIMeetings(getMeetingsResp.data);
    };
    getMeetings();
  }, []);
  useEffect(() => {
    if (meeting) {
      meetStates.setStates({
        ...meetStates.states,
        callState: 'started',
        call: meeting,
      });
    }
  }, [meetStates, meeting]);
  if (!apiMeetings) {
    return <></>;
  }
  return (
    <ScrollView>
      <Text className="text-2xl font-bold text-gray-400 mx-2 mt-10">
        FaceTime
      </Text>
      {apiMeetings.map(
        (apiMeeting: { title: string; updated_at: string }, index: number) => {
          return (
            <MeetingTile
              key={index}
              meeting={apiMeeting}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onClick={async apiMeet => {
                // TODO: Get a token here
                initMeeting({
                  authToken: token.authToken,
                  defaults: {
                    audio: true,
                    video: true,
                  },
                });
              }}
            />
          );
        },
      )}
    </ScrollView>
  );
}
