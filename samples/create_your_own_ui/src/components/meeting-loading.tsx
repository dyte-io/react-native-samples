import React from 'react';
import {RtkSpinner} from '@cloudflare/realtimekit-react-native-ui';

function MeetingLoading() {
  /**
   * NOTE(ravindra-dyte): Don't like the default spinner?
   * You can replace DyteSpinner with your own screen, here.
   */
  return <RtkSpinner />;
}

export default MeetingLoading;
