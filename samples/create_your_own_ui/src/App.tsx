import React, {useEffect, useState} from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-native-core';
import {
  DyteUIProvider,
  UIConfig,
  defaultConfig,
  generateConfig,
} from '@dytesdk/react-native-ui-kit';
import {DyteStateListenersUtils} from './dyte-state-listeners';
import {CustomStates} from './types';
import CustomDyteMeeting from './components/custom-dyte-meeting';

function Meeting() {
  const {meeting} = useDyteMeeting();
  const [config, setConfig] = useState<UIConfig>(defaultConfig);
  const [states, setStates] = useState<CustomStates>({
    meeting: 'setup',
    sidebar: 'chat',
    activeMoreMenu: false,
    activeLeaveConfirmation: false,
    permissionGranted: true,
    prefs: {
      mirrorVideo: true,
      muteNotificationSounds: false,
      autoScroll: true,
    },
    designSystem: {
      colors: {
        brand: {
          300: '#497CFD',
          400: '#356EFD',
          500: '#2160FD',
          600: '#0D51FD',
          700: '#2160FD',
        },
        background: {
          1000: '#080808',
          900: '#1A1A1A',
          800: '#333333',
          700: '#4C4C4C',
          600: '#666666',
        },
        text: '#FFFFFF',
        textOnBrand: '#FFFFFF',
        videoBg: '#333333',
        success: '#83D017',
        danger: '#FF2D2D',
        warning: '#FFCD07',
      },
    },
  });

  useEffect(() => {
    async function setupMeetingConfigs() {
      const theme = meeting!.self.config;
      const generatedConfig = generateConfig(theme, {});
      const newConfig = generatedConfig.config;
      /**
       * NOTE(ravindra-dyte):
       * Full screen by default requests dyte-meeting/DyteMeeting element to be in full screen.
       * Since DyteMeeting element is not here,
       *  we need to pass dyte-fullscreen-toggle, an targetElementId through config.
       */
      // setFullScreenToggleTargetElement({config, targetElementId: 'root'});

      setConfig({...newConfig});

      /**
       * NOTE(ravindra-dyte):
       * Add listeners on meeting & self to monitor leave meeting, join meeting and so on.
       * This work was earlier done by DyteMeeting component internally.
       */
      const stateListenersUtils = new DyteStateListenersUtils(
        () => meeting,
        () => states,
        () => setStates,
      );
      stateListenersUtils.addDyteEventListeners();
    }

    if (meeting) {
      /**
       * NOTE(ravindra-dyte):
       * During development phase, make sure to expose meeting object to window,
       * for debugging purposes.
       */
      setupMeetingConfigs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);
  return (
    <CustomDyteMeeting
      meeting={meeting}
      config={config}
      states={states}
      setStates={setStates}
    />
  );
}

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    async function initalizeMeeting() {
      const authToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6IjcyNzNmYzAwLTAzY2MtNGMwNC1iZTliLTk4YzhhYmE4OTQxZSIsIm1lZXRpbmdJZCI6ImJiYmMyNzdkLTIzZTAtNDI4ZC1hNjE1LTNmNDgwZDBiOWJiZCIsInBhcnRpY2lwYW50SWQiOiJhYWExNDAzNi1mNmEyLTRlN2ItOTEwNS0yM2Q5ZDAwZDJjNTYiLCJwcmVzZXRJZCI6Ijg0ZWVjMTYxLWVmOWQtNGZlMi1iZTEzLTZkMDJlM2UwOTU5NSIsImlhdCI6MTc0MTY2OTk0OCwiZXhwIjoxNzUwMzA5OTQ4fQ.VsJq7dK0G9zjwD69Y-Ul855mjwhmDvtqjZpj-SIm4V2IUlSaOEyeaahvGfiE76PyJZNiBgNkih-bC8O349cebGsERIV2HXMf7V0f0QiPjypv7Q2V1_mn19yZgxOThwwa4U8ubKunVQnVPLKQVMbgqBBargqq2mFDXDPD3SzoOSO-X0afYvYa98BR7Li6vCQ0mO_60cf1bKbYaqNVvyqxiKbLOahquONz1_dxKSZGHD2CCj8lE6NgdSUmx3lBil8ZwVD9nIMfruGfOGeOMLjW_A0m3zdqfYhTCa1dAIrPXYnGl2oBueI1AZu5uJdKiVdOMpJFuuj3lz6jPDquvy7F-Q';

      if (!authToken) {
        console.log(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }

      await initMeeting({
        authToken,
        defaults: {
          audio: true,
          video: true,
        },
      });
    }

    if (!meeting) {
      initalizeMeeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);

  return (
    <DyteUIProvider>
      <DyteProvider value={meeting}>
        <Meeting />
      </DyteProvider>
    </DyteUIProvider>
  );
}

export default App;
