import React from 'react';
import {
  RtkClock,
  RtkGridPagination,
  RtkHeader,
  RtkLiveStreamIndicator,
  RtkLogo,
  RtkMeetingTitle,
  RtkParticipantCount,
  RtkRecordingIndicator,
  defaultIconPack,
  useLanguage,
} from '@cloudflare/realtimekit-react-native-ui';
import {UIConfig} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
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
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  const icons = defaultIconPack;
  return (
    <RtkHeader
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
  meeting: RealtimeKitClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  const t = useLanguage();
  return (
    <View className="flex justify-between bg-black text-white">
      <View className="flex items-center h-[24px]">
        <RtkLogo meeting={meeting} />
        <RtkRecordingIndicator meeting={meeting} />
        <RtkLiveStreamIndicator meeting={meeting} />
      </View>
      <View className="flex items-center h-[24px]">
        <RtkMeetingTitle meeting={meeting} />
      </View>
      <View className="flex items-center h-[24px]">
        <RtkGridPagination meeting={meeting} states={states} />
        <RtkParticipantCount meeting={meeting} t={t} />
        <RtkClock meeting={meeting} />
      </View>
    </View>
  );
}

// export default HeaderPreBuilt; // uncomment if you want the pre built Dyte header
export default HeaderWithCustomUI; // uncomment if yoi want custom UI
