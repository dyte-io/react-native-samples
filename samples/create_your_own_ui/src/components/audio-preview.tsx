import React from 'react';
import DyteClient from '@dytesdk/web-core';
import {useEffect, useState} from 'react';
import {
  DyteAudioVisualizer,
  DyteButton,
  DyteIcon,
  DyteSettingsAudio,
  DyteText,
  defaultIconPack,
} from '@dytesdk/react-native-ui-kit';
import {CustomStates, SetStates} from '../types';
import {UIConfig, Theme} from '@dytesdk/react-native-ui-kit';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AudioPreviewPreBuilt({
  meeting,
  states,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return <DyteSettingsAudio meeting={meeting} states={states} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AudioPreviewWithCustomUI({
  meeting,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const colors = states.designSystem?.colors ?? Theme.colors;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(1);
  const [devicesAudio, setAudioDevices] = useState([]);
  useEffect(() => {
    const load = async () => {
      const audio = await meeting.self.getAudioDevices();
      const _devicesAudio: any = [];
      audio.map((item: any) => {
        let name =
          item.deviceId[0].toUpperCase() +
          item.deviceId.substring(1, item.deviceId.length);
        _devicesAudio.push({
          label: name,
          value: _devicesAudio.length + 1,
          deviceId: item.deviceId,
          kind: item.kind,
        });
      });
      setAudioDevices(_devicesAudio);
    };
    load();
  }, [meeting]);

  const testAudio = () => {
    // Play your audio here
  };
  const renderItem = (item: any) => {
    return (
      <View style={styles.renderContainer}>
        <DyteText style={styles.renderText}>{item.label}</DyteText>
      </View>
    );
  };
  const selectAudio = (_device: any) => {
    //Update Radio Button
    devicesAudio.forEach(async (data: any) => {
      if (data.label === _device.label) {
        await meeting.self.setDevice(data);
        return;
      }
    });
  };
  const styles = StyleSheet.create({
    renderContainer: {
      backgroundColor: colors.background![800],
      padding: 10,
    },
    renderText: {
      color: colors.text,
    },
    dropdown: {
      flex: 5,
      backgroundColor: colors.background![800],
      marginLeft: -5,
      marginRight: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    dropdownContainer: {
      borderColor: colors.background![800],
      borderWidth: 2,
    },
    dropdownSelectedText: {
      color: colors.text,
      marginLeft: 10,
    },
  });
  return (
    <View className="flex flex-col p-4">
      {meeting.self.permissions.canProduceAudio === 'ALLOWED' && (
        <View>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <DyteText style={{marginVertical: 8}}>Microphone</DyteText>
          <View className="flex flex-row">
            <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.dropdownSelectedText}
              containerStyle={styles.dropdownContainer}
              renderItem={renderItem}
              data={devicesAudio}
              labelField={'label'}
              valueField={'value'}
              value={currentDeviceIndex}
              onChange={selectAudio}
            />
            <DyteAudioVisualizer participant={meeting?.self} />
          </View>
        </View>
      )}
      <View>
        <DyteButton
          size="sm"
          variant="secondary"
          kind="button"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginVertical: 8,
            padding: 4,
          }}
          onClick={() => testAudio()}>
          <View className="flex flex-row p-2">
            <DyteIcon icon={defaultIconPack.speaker} />
            <DyteText>Test</DyteText>
          </View>
        </DyteButton>
      </View>
    </View>
  );
}

// export default AudioPreviewPreBuilt; // uncomment if you want to use prebuilt audio preview
export default AudioPreviewWithCustomUI; // uncomment if you want custom ui for audio preview
