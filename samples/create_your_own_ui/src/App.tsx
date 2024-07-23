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
import {DyteThemePresetV1} from '@dytesdk/web-core';
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
      const generatedConfig = generateConfig(theme as DyteThemePresetV1, {});
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
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6IjM5MGJmMjc0LTQxMzMtNDI2ZC04NDkxLWVhN2ExYTE5MDQ4YiIsIm1lZXRpbmdJZCI6ImJiYjU0MzMzLWJmNDgtNDgwMC04ZDU3LWVmNzIwOWY1MDlhNCIsInBhcnRpY2lwYW50SWQiOiJhYWFiMGNjOC1kZTg5LTQwYzMtYWRmMi0wZTUxMmViZDZhNjkiLCJwcmVzZXRJZCI6IjJhZWI3Y2RhLWYxNGUtNDVlMC05MDk3LTM1ZWI3ODhjYzZjMiIsImlhdCI6MTcyMTYyNTgzMywiZXhwIjoxNzMwMjY1ODMzfQ.ko9H_AN1g_PSlzUUL9P5xK641I_ysraSnpWKsf-RrdkRcVXK06nZUB0NAsMva90uwZGVg23jWOgIkzD9nmkaB1lMMt3nEEWuPaOyei1NxbzccX9kE9fhbAxoBC2WgEBvmHxc0XDhs5s1irQgIhCqej45uA9L1vP9D4yWtcGUDm4ClCw9RwF0sJs_EfogySVCebLV07VqivxytUJE_clCGGCWq3ujM5CcYItbJolqhPURtJ8IlXjGkIawd9VCAr7K5XzWD4LARpu1jgWUhR1sdpQ6TWQQgjTlz0vfhjUDmorvu_ZuDi7b-fEKhwkcd0sHq2I-8lpK_It9F-urQOqrOw';

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
        modules: {devTools: {logs: true}},
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
