import React from 'react';
import {
  RtkCameraToggle,
  RtkChatToggle,
  RtkControlbar,
  RtkControlbarButton,
  // DyteControlbarButton,
  RtkLeaveButton,
  RtkMicToggle,
  RtkMoreToggle,
  RtkMuteToggle,
  // DyteParticipantToggle,
  RtkPluginsToggle,
  // DytePoll,
  RtkPollsToggle,
  RtkRecordingToggle,
  RtkScreenShareToggle,
  RtkSettingsToggle,
  useLanguage,
} from '@cloudflare/realtimekit-react-native-ui';
import {UIConfig, defaultIconPack} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ControlBarPreBuilt({
  meeting,
  states,
  config,
}: {
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return (
    <RtkControlbar
      meeting={meeting}
      config={config}
      states={states}
      // className="flex w-full overflow-visible	justify-between"
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ControlBarWithCustomUI({
  meeting,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config,
  setStates,
}: {
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  return (
    <>
      {states.activeMoreMenu && (
        <View className="absolute bottom-[60px] w-full">
          <RtkMuteToggle meeting={meeting} />
          <RtkRecordingToggle meeting={meeting} variant="horizontal" />
          <RtkScreenShareToggle meeting={meeting} variant="horizontal" />
          <RtkChatToggle
            meeting={meeting}
            states={states}
            variant="horizontal"
          />
          <RtkPollsToggle
            meeting={meeting}
            states={states}
            variant="horizontal"
          />
          <RtkPluginsToggle
            meeting={meeting}
            states={states}
            t={t}
            variant="horizontal"
          />
          <RtkSettingsToggle states={states} variant="horizontal" />
          <RtkControlbarButton
            variant="horizontal"
            onClick={() => {
              if (
                states.activeSidebar &&
                !states.sidebar &&
                states.customSidebar === 'warnings'
              ) {
                setStates(oldState => {
                  return {
                    ...oldState,
                    activeSidebar: false,
                    sidebar: null,
                    customSidebar: null,
                  };
                });
              } else {
                setStates(oldState => {
                  return {
                    ...oldState,
                    activeSidebar: true,
                    sidebar: null,
                    customSidebar: 'warnings',
                  };
                });
              }
            }}
            icon={defaultIconPack.add}
            label={'Open Custom SideBar'}
          />
        </View>
      )}
      <View className="flex-row bg-black text-white justify-evenly">
        <RtkMicToggle meeting={meeting} variant="horizontal" />
        <RtkCameraToggle meeting={meeting} variant="horizontal" />
        <RtkMoreToggle
          meeting={meeting}
          iconPack={defaultIconPack}
          variant="horizontal"
          t={useLanguage()}
        />
        <RtkLeaveButton t={t} />
      </View>
    </>
  );
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar
