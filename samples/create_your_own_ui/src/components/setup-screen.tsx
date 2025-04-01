import React from 'react';
import type DyteClient from '@dytesdk/web-core';
import {
  defaultIconPack,
  DyteControlbarButton,
  DyteText,
  DyteTextField,
  UIConfig,
} from '@dytesdk/react-native-ui-kit';
import {CustomStates, SetStates} from '../types';
import {DyteDialogManager, DyteSetupScreen} from '@dytesdk/react-native-ui-kit';
import {
  DyteParticipantTile,
  DyteMicToggle,
  DyteCameraToggle,
  DyteSettingsToggle,
  DyteButton,
} from '@dytesdk/react-native-ui-kit';
import MediaPreviewModal from './media-preview-modal';
import {useEffect, useState} from 'react';
import {View} from 'react-native';

export function SetupScreenPreBuilt({
  meeting,
  config,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return (
    <View
      className="w-full h-full"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: '#272727',
        // color: '#ffffff',
      }}>
      <DyteSetupScreen meeting={meeting} config={config} states={states} />
      <DyteDialogManager meeting={meeting} config={config} states={states} />
    </View>
  );
}

export function CustomSetupScreenWithPrebuiltMediaPreviewModal({
  meeting,
  config,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const [participantName, setParticipantName] = useState(
    meeting.self?.name ?? 'Your Name',
  );
  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <>
      <View
        key="on-setup-screen"
        className="flex items-center justify-center w-full h-full p-[5%] bg-black text-white">
        <DyteParticipantTile
          meeting={meeting}
          participant={meeting.self}
          config={config}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 400,
            width: 300,
          }}
        />
        {/* </View> */}
        <View className="flex flex-row items-center justify-evenly w-full">
          <DyteMicToggle meeting={meeting} size="sm" />
          <DyteCameraToggle meeting={meeting} size="sm" />
          <DyteSettingsToggle states={states} size="sm" />
        </View>
        <View className="flex flex-col items-center justify-between w-full">
          <View className="flex flex-col items-center justify-center w-full p-[2%]">
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <DyteText style={{marginVertical: 5}}>Joining as</DyteText>
            <DyteText>{participantName}</DyteText>
          </View>
          <View className="flex flex-row items-center justify-center w-3/4 my-2">
            <DyteTextField
              disabled={!meeting.self.permissions.canEditDisplayName}
              placeholder={meeting.self?.name ?? 'Your Name'}
              onChangeText={s => {
                setParticipantName(s);
              }}
            />
          </View>
          <View className="flex flex-row items-center justify-center w-3/4">
            <DyteButton
              kind="wide"
              size="md"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{cursor: participantName ? 'pointer' : 'not-allowed'}}
              onClick={async () => {
                if (participantName) {
                  if (meeting.self.permissions.canEditDisplayName) {
                    await meeting.self.setName(participantName);
                  }
                  await meeting.join();
                }
              }}>
              <DyteText>Join</DyteText>
            </DyteButton>
          </View>
        </View>
      </View>
      <DyteDialogManager meeting={meeting} config={config} states={states} />
    </>
  );
}

export function CustomSetupScreenWithCustomMediaPreviewModal({
  meeting,
  config,
  states,
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <>
      <View
        key="on-setup-screen"
        className="flex items-center justify-center w-full h-full p-[5%] bg-black text-white">
        <DyteParticipantTile
          meeting={meeting}
          participant={meeting.self}
          config={config}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 400,
            width: 300,
          }}
        />
        <View className="flex flex-row items-center justify-evenly w-full">
          <DyteMicToggle meeting={meeting} size="sm" />
          <DyteCameraToggle meeting={meeting} size="sm" />
          <DyteControlbarButton
            onClick={() => {
              setStates(oldState => {
                return {...oldState, activeMediaPreviewModal: true};
              });
            }}
            icon={defaultIconPack.settings}
            label={'Media Preview'}
          />
        </View>
        <View className="flex flex-col items-center justify-between w-full">
          <View className="flex flex-col items-center justify-center w-full p-[2%]">
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <DyteText style={{marginVertical: 5}}>Joining as</DyteText>
            <DyteText>{participantName}</DyteText>
          </View>
          <View className="flex flex-row items-center justify-center w-3/4 my-2">
            <DyteTextField
              disabled={!meeting.self.permissions.canEditDisplayName}
              placeholder={meeting.self?.name ?? 'Your Name'}
              onChangeText={s => setParticipantName(s)}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: '100%',
              }}
            />
          </View>
          <View className="flex flex-row items-center justify-center w-3/4">
            <DyteButton
              kind="wide"
              size="md"
              onClick={async () => {
                if (participantName) {
                  if (meeting.self.permissions.canEditDisplayName) {
                    await meeting.self.setName(participantName);
                  }
                  await meeting.join();
                }
              }}>
              <DyteText>Join</DyteText>
            </DyteButton>
          </View>
        </View>
      </View>
      <MediaPreviewModal
        open={!!states.activeMediaPreviewModal}
        states={states}
        config={config}
        setStates={setStates}
        meeting={meeting}
      />
    </>
  );
}

// export default SetupScreenPreBuilt; // Uncomment, if you want prebuild setup screen
// export default CustomSetupScreenWithPrebuiltMediaPreviewModal; // Uncomment, if you want custom setup screen with prebuilt media preview
export default CustomSetupScreenWithCustomMediaPreviewModal; // Uncomment, if you want custom setup screen with custom media preview
