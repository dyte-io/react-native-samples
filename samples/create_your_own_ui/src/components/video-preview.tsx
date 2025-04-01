import React from 'react';
import DyteClient from '@dytesdk/web-core';
import {useEffect, useState} from 'react';
import {
  DyteParticipantTile,
  DyteSettingsVideo,
  DyteText,
  Theme,
} from '@dytesdk/react-native-ui-kit';
import {CustomStates, SetStates} from '../types';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VideoPreviewPreBuilt({
  meeting,
  states,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return <DyteSettingsVideo meeting={meeting} states={states} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VideoPreviewWithCustomUI({
  meeting,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const colors = states.designSystem?.colors ?? Theme.colors;
  const [devicesVideo, setVideoDevices] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(1);
  useEffect(() => {
    const load = async () => {
      const video = await meeting.self.getVideoDevices();
      const _devicesVideo: any = [];
      video.map((item: any) => {
        const name =
          item.facing[0].toUpperCase() +
          item.facing.substring(1, item.facing.length);
        // Label and Value needed for Dropdown component
        if (name !== 'Environment') {
          _devicesVideo.push({
            label: name,
            value: _devicesVideo.length + 1,
            deviceId: item.deviceId,
            kind: item.kind,
          });
        } else {
          _devicesVideo.push({
            label: 'Rear',
            value: _devicesVideo.length + 1,
            deviceId: item.deviceId,
            kind: item.kind,
          });
        }
      });
      setVideoDevices(_devicesVideo);
    };
    load();
  }, [meeting]);
  const selectVideo = (_device: any) => {
    devicesVideo.forEach(async (data: any) => {
      if (data.label === _device.label) {
        await meeting.self.setDevice(data);
        return;
      }
    });
  };
  const renderItem = (item: any) => {
    return (
      <View style={styles.renderContainer}>
        <DyteText style={styles.renderText}>{item.label}</DyteText>
      </View>
    );
  };
  const styles = StyleSheet.create({
    dropdown: {
      backgroundColor: colors.background![800],
      marginLeft: 0,
      marginRight: 10,
      alignItems: 'center',
      borderRadius: 5,
      width: '90%',
    },
    dropdownContainer: {
      borderColor: colors.background![800],
      borderWidth: 2,
    },
    dropdownText: {
      color: colors.text,
      marginLeft: 10,
    },
    renderContainer: {
      backgroundColor: colors.background![800],
      padding: 10,
    },
    renderText: {
      color: colors.text,
    },
    videoWrapper: {
      marginHorizontal: 10,
    },
    videoContainer: {
      alignItems: 'center',
      marginBottom: '5%',
      //borderWidth: meeting.self.videoEnabled ? 0 : 0.6,
      borderColor: colors.text,
    },
    videoOptionText: {
      marginBottom: 10,
      color: colors.text,
    },
  });
  return (
    <View className="flex flex-col justify-center">
      <View>
        {meeting.self.videoEnabled === true ? (
          <DyteParticipantTile
            meeting={meeting}
            participant={meeting?.self}
            states={states}
            isPreview
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: 200,
              width: 300,
            }}
          />
        ) : (
          <View>
            <DyteParticipantTile
              meeting={meeting}
              participant={meeting?.self}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                height: 200,
                width: 300,
              }}
            />
          </View>
        )}
      </View>
      {meeting.self.permissions.canProduceVideo === 'ALLOWED' && (
        <View>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <DyteText style={{marginVertical: 8}}>Camera</DyteText>
          <View className="flex flex-row">
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownText}
              renderItem={renderItem}
              data={devicesVideo}
              labelField={'label'}
              valueField={'value'}
              value={currentDeviceIndex}
              onChange={selectVideo}
            />
          </View>
        </View>
      )}
    </View>
  );
}

// export default VideoPreviewPreBuilt; // uncomment if you want to use prebuilt video preview
export default VideoPreviewWithCustomUI; // uncomment if you want custom ui for video preview
