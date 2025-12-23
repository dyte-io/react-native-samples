import React from 'react';
import {
  RtkChat,
  RtkParticipants,
  RtkPlugins,
  RtkPolls,
  RtkSidebar,
  // DyteSidebarUi,
} from '@cloudflare/realtimekit-react-native-ui';
import {UIConfig} from '@cloudflare/realtimekit-react-native-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates, SetStates} from '../types';
import {useState} from 'react';
import {View} from 'react-native';

function SidebarPreBuilt({
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
  if (!states.activeSidebar) {
    return null;
  }
  return (
    <RtkSidebar
      meeting={meeting}
      config={config}
      states={states}
      defaultSection={states.sidebar ?? 'chat'}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SidebarWithCustomUI({
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabs, setTabs] = useState([
    {id: 'chat', name: 'chat'},
    {id: 'polls', name: 'polls'},
    {id: 'participants', name: 'participants'},
    {id: 'plugins', name: 'plugins'},
    {id: 'warnings', name: 'warnings'},
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState('sidebar');

  if (!states.activeSidebar || (!states.sidebar && !states.customSidebar)) {
    return null;
  }

  const currentTab = states.sidebar || states.customSidebar;

  return (
    <>
      {currentTab === 'chat' && <RtkChat meeting={meeting} config={config} />}
      {currentTab === 'polls' && (
        <RtkPolls meeting={meeting} config={config} />
      )}
      {currentTab === 'participants' && (
        <RtkParticipants meeting={meeting} config={config} states={states} />
      )}
      {currentTab === 'plugins' && (
        <RtkPlugins meeting={meeting} config={config} />
      )}
      {currentTab === 'warnings' && (
        <View className="flex justify-center items-center">
          <View>Do not cheat in the exam</View>
        </View>
      )}
    </>
  );
}

export default SidebarPreBuilt; // Uncomment if you want prebuilt sidebar
// export default SidebarWithCustomUI; // Uncomment if you want custom sidebar
