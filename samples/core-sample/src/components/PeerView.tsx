/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { MediaStream, RTCView } from 'react-native-webrtc';
import { ActivityIndicator, View } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { useRef } from 'react';
import { useDyteSelector } from '@dytesdk/react-native-core';

type Props = {
  participant: any;
  width: number;
  height?: number;
  isScreenshare?: boolean;
  mirrorVideo?: boolean;
};

export default function PeerView(props: Props) {
  const [peerStream, setPeerStream] = useState(new MediaStream(undefined));
  const self = useDyteSelector(m => m.self);
  const { participant } = props;
  const {
    videoTrack,
    videoEnabled,
    picture,
    name,
    screenShareEnabled,
    screenShareTracks,
  } = participant;
  const videoTrackRef = useRef(null);
  const setVideoTrack = (_videoTrack: any) => {
    if (_videoTrack) {
      const stream = new MediaStream(undefined);
      stream.addTrack(_videoTrack);
      setPeerStream(stream);
    }
  };

  useEffect(() => {
    if (
      props.isScreenshare &&
      screenShareTracks?.video &&
      screenShareEnabled &&
      videoTrackRef.current?.id !== screenShareTracks.video.id
    ) {
      setVideoTrack(screenShareTracks?.video);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenShareEnabled, screenShareTracks?.video]);

  useEffect(() => {
    // console.log('eee', videoEnabled, videoTrack);
    if (!props.isScreenshare && videoTrackRef.current?.id !== videoTrack?.id) {
      setVideoTrack(videoTrack);
      videoTrackRef.current = videoTrack;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEnabled, videoTrack]);

  const { height: propsHeight, width } = props;
  const height = propsHeight || Math.floor(width * 0.5625);
  const video =
    self.mediaPermissions.video === 'ACCEPTED'
      ? self.getCurrentDevices().video
      : null;
  const renderVideo = () => {
    return (
      <RTCView
        //@ts-ignore
        objectFit={props.isScreenshare ? 'contain' : 'cover'}
        style={{ flex: 1 }}
        streamURL={peerStream.toURL()}
        mirror={
          props.mirrorVideo ?? video?.facing === 'environment' ? false : true
        }
        zOrder={1}
      />
    );
  };

  const renderVideoDisabled = () => {
    return (
      <View
        style={[
          { justifyContent: 'center' },
          { alignItems: 'center' },
          { width: width - 8 },
          { height: height - 8 },
        ]}>
        {videoEnabled ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <UserAvatar
            size={50}
            src={picture}
            name={(name ?? 'Dyte').trim().length !== 0 ? name : 'Dyte'}
            bgColor={'#2160FD'}
            textColor={'#FFFFFF'}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        {
          backgroundColor: '#333333',
          borderRadius: 8,
          width: width - 8,
          height: height - 8,
          overflow: 'hidden',
        },
      ]}>
      {((!props.isScreenshare && videoEnabled && videoTrack) ||
        (props.isScreenshare &&
          screenShareEnabled &&
          screenShareTracks?.video)) &&
      peerStream
        ? renderVideo()
        : renderVideoDisabled()}
    </View>
  );
}

PeerView.defaultProps = {
  height: 0,
};
