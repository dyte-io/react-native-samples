import RealtimeKitClient from '@cloudflare/realtimekit';
import {CustomStates} from './types';

export class DyteStateListenersUtils {
  getStates: () => CustomStates;

  getStateSetter: () => (newState: CustomStates) => void;

  getMeeting: () => RealtimeKitClient;

  get states() {
    return this.getStates();
  }

  get setGlobalStates() {
    return this.getStateSetter();
  }

  get meeting() {
    return this.getMeeting();
  }

  constructor(
    getMeeting: () => RealtimeKitClient,
    getGlobalStates: () => CustomStates,
    getGlobalStateSetter: () => (newState: CustomStates) => void,
  ) {
    this.getMeeting = getMeeting;
    this.getStates = getGlobalStates;
    this.getStateSetter = getGlobalStateSetter;
  }
  private updateStates(newState: CustomStates) {
    this.setGlobalStates((oldState: CustomStates) => {
      return {
        ...oldState,
        ...newState,
      };
    });
  }
  private roomJoinedListener = () => {
    this.updateStates({meeting: 'joined'});
  };

  private socketServiceRoomJoinedListener = () => {
    if (
      this.meeting.stage.status === 'ON_STAGE' ||
      this.meeting.stage.status === undefined
    ) {
      return;
    }
    this.updateStates({meeting: 'joined'});
  };

  private waitlistedListener = () => {
    this.updateStates({meeting: 'waiting'});
  };

  private roomLeftListener = ({state}: {state: any}) => {
    const states = this.states;
    if (states?.roomLeftState === 'disconnected') {
      this.updateStates({meeting: 'ended', roomLeftState: state});
      return;
    }
    this.updateStates({meeting: 'ended', roomLeftState: state});
  };

  private mediaPermissionUpdateListener = ({
    kind,
    message,
  }: {
    kind: any; // PermissionSettings['kind'];
    message: string;
  }) => {
    if (['audio', 'video'].includes(kind!)) {
      if (
        message === 'ACCEPTED' ||
        message === 'NOT_REQUESTED' ||
        this.states.activeDebugger
      ) {
        return;
      }
      const permissionModalSettings: any = {
        enabled: true,
        kind,
      };
      this.updateStates({activePermissionsMessage: permissionModalSettings});
    }
  };

  private joinStateAcceptedListener = () => {
    this.updateStates({activeJoinStage: true});
  };

  private handleChangingMeeting(destinationMeetingId: string) {
    this.updateStates({
      activeBreakoutRoomsManager: {
        ...this.states.activeBreakoutRoomsManager,
        active: this.states.activeBreakoutRoomsManager!.active,
        destinationMeetingId,
      },
    });
  }

  addDyteEventListeners() {
    if (this.meeting.meta.viewType === 'LIVESTREAM') {
      this.meeting.stage.addListener(
        'stageStatusUpdate',
        this.socketServiceRoomJoinedListener,
      );
    }
    this.meeting.self.addListener('roomJoined', this.roomJoinedListener);

    this.meeting.self.addListener('waitlisted', this.waitlistedListener);
    this.meeting.self.addListener('roomLeft', this.roomLeftListener);
    this.meeting.self.addListener(
      'mediaPermissionUpdate',
      this.mediaPermissionUpdateListener,
    );
    this.meeting.stage.addListener(
      'stageStatusUpdate',
      this.joinStateAcceptedListener,
    );

    if (this.meeting.connectedMeetings.supportsConnectedMeetings) {
      this.meeting.connectedMeetings.once(
        'changingMeeting',
        this.handleChangingMeeting,
      );
    }
  }
  cleanupDyteEventListeners() {}
}
