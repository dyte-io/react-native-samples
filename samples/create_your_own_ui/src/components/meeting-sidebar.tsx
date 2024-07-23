import React from 'react';
import {
  DyteChat,
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteSidebar,
  // DyteSidebarUi,
} from '@dytesdk/react-native-ui-kit';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
import DyteClient from '@dytesdk/web-core';
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
  meeting: DyteClient;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
}) {
  if (!states.activeSidebar) {
    return null;
  }
  return (
    <DyteSidebar
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
  meeting: DyteClient;
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
      {currentTab === 'chat' && <DyteChat meeting={meeting} config={config} />}
      {currentTab === 'polls' && (
        <DytePolls meeting={meeting} config={config} />
      )}
      {currentTab === 'participants' && (
        <DyteParticipants meeting={meeting} config={config} states={states} />
      )}
      {currentTab === 'plugins' && (
        <DytePlugins meeting={meeting} config={config} />
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
