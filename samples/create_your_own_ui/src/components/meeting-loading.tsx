import React from 'react';
import {DyteSpinner} from '@dytesdk/react-native-ui-kit';

function MeetingLoading() {
  /**
   * NOTE(ravindra-dyte): Don't like the default spinner?
   * You can replace DyteSpinner with your own screen, here.
   */
  return <DyteSpinner />;
}

export default MeetingLoading;
