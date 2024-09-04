import RNCallKeep from 'react-native-callkeep';
import ramdomUuid from 'uuid-random';

export const getCurrentCallId = (currentCallId: string | null) => {
  if (!currentCallId) {
    currentCallId = ramdomUuid().toLowerCase();
  }
  return currentCallId;
};

export const initializeCallKeep = async (
  onNativeCall: any,
  onAnswerCallAction: any,
  onEndCallAction: any,
  onIncomingCallDisplayed: any,
  onToggleMute: any,
  onDTMF: any,
) => {
  try {
    await RNCallKeep.setup({
      ios: {
        appName: 'Dyte CallKit Demo',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        additionalPermissions: [],
      },
    });
    RNCallKeep.setAvailable(true);
  } catch (err: any) {
    console.error('initializeCallKeep error:', err.message);
  }

  RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
  RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
  RNCallKeep.addEventListener('endCall', onEndCallAction);
  RNCallKeep.addEventListener(
    'didDisplayIncomingCall',
    onIncomingCallDisplayed,
  );
  RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
  RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
};
