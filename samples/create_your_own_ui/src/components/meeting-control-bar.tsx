import React from 'react';
import {
  DyteCameraToggle,
  DyteChatToggle,
  DyteControlbar,
  DyteControlbarButton,
  // DyteControlbarButton,
  DyteLeaveButton,
  DyteMicToggle,
  DyteMoreToggle,
  DyteMuteToggle,
  // DyteParticipantToggle,
  DytePluginsToggle,
  // DytePoll,
  DytePollsToggle,
  DyteRecordingToggle,
  DyteScreenShareToggle,
  DyteSettingsToggle,
  useLanguage,
} from '@dytesdk/react-native-ui-kit';
import {UIConfig, defaultIconPack} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ControlBarPreBuilt({
  meeting,
  states,
  config,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  return (
    <DyteControlbar
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
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  return (
    <>
      {states.activeMoreMenu && (
        <View className="absolute bottom-[60px] w-full">
          <DyteMuteToggle meeting={meeting} />
          <DyteRecordingToggle meeting={meeting} variant="horizontal" />
          <DyteScreenShareToggle meeting={meeting} variant="horizontal" />
          <DyteChatToggle
            meeting={meeting}
            states={states}
            variant="horizontal"
          />
          <DytePollsToggle
            meeting={meeting}
            states={states}
            variant="horizontal"
          />
          <DytePluginsToggle
            meeting={meeting}
            states={states}
            t={t}
            variant="horizontal"
          />
          <DyteSettingsToggle states={states} variant="horizontal" />
          <DyteControlbarButton
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
        <DyteMicToggle meeting={meeting} variant="horizontal" />
        <DyteCameraToggle meeting={meeting} variant="horizontal" />
        <DyteMoreToggle
          iconPack={defaultIconPack}
          variant="horizontal"
          t={useLanguage()}
        />
        <DyteLeaveButton t={t} />
      </View>
    </>
  );
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar
