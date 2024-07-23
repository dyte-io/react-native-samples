import React from 'react';
import {
  DyteClock,
  DyteGridPagination,
  DyteHeader,
  DyteLiveStreamIndicator,
  DyteLogo,
  DyteMeetingTitle,
  DyteParticipantCount,
  DyteRecordingIndicator,
  defaultIconPack,
  useLanguage,
} from '@dytesdk/react-native-ui-kit';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HeaderPreBuilt({
  meeting,
  states,
  config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStates,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  const icons = defaultIconPack;
  return (
    <DyteHeader
      meeting={meeting}
      iconPack={icons}
      t={t}
      config={config}
      states={states}
      // className="flex justify-between"
    />
  );
}

function HeaderWithCustomUI({
  meeting,
  states,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config,
}: {
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  return (
    <View className="flex justify-between bg-black text-white">
      <View className="flex items-center h-[24px]">
        <DyteLogo meeting={meeting} />
        <DyteRecordingIndicator meeting={meeting} />
        <DyteLiveStreamIndicator meeting={meeting} />
      </View>
      <View className="flex items-center h-[24px]">
        <DyteMeetingTitle meeting={meeting} />
      </View>
      <View className="flex items-center h-[24px]">
        <DyteGridPagination meeting={meeting} states={states} />
        <DyteParticipantCount meeting={meeting} t={t} />
        <DyteClock meeting={meeting} />
      </View>
    </View>
  );
}

// export default HeaderPreBuilt; // uncomment if you want the pre built Dyte header
export default HeaderWithCustomUI; // uncomment if yoi want custom UI
