import React, {useReducer, useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  ListRenderItem,
} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import {DyteProvider, useDyteClient} from '@dytesdk/react-native-core';
import CallScreen from './CallScreen';
import {reducer, initialState} from '../utils/states';
import {getCurrentCallId, initializeCallKeep} from '../utils/call_handlers';
import {DyteUIProvider} from '@dytesdk/react-native-ui-kit';
import database from '@react-native-firebase/database';

interface Contact {
  id: string;
  name: string;
  meetingId: string;
}

interface CallSession {
  number: string;
  cameraEnabled: boolean;
}

const Dialer: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [meeting, initMeeting] = useDyteClient();
  const {number, ringing, inCall, ready} = state;
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const selfCallerID = 'randomid123';
  const selfName = 'Mayank';
  const [receiverID, setReceiverID] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const initializingRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      await initializeCallKeep(
        onNativeCall,
        onAnswerCallAction,
        onEndCallAction,
        onIncomingCallDisplayed,
        onToggleMute,
        onDTMF,
      );
      dispatch({type: 'SET_READY', ready: true});
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const snapshot = await database().ref('/contacts').once('value');
      const data = snapshot.val();
      if (data && typeof data === 'object') {
        const jsonData = JSON.stringify(data);
        const contactList = Object.entries(JSON.parse(jsonData))
          .filter(([id]) => id !== selfCallerID)
          .map(([id, details]: [string, any]) => ({
            id,
            name: details.name,
            meetingId: details.selfMeetingId,
          }));
        setContacts(contactList);
      }
    };
    fetchContacts();
  }, [selfCallerID]);

  useEffect(() => {
    const getActiveCallerDetails = async (id: string) => {
      const snapshot = await database().ref(`/contacts/${id}`).once('value');
      const data = snapshot.val();
      return {name: data.name, meetingId: data.selfMeetingId};
    };
    const onActiveCallChange = database()
      .ref(`/contacts/${selfCallerID}`)
      .on('value', async snapshot => {
        const contact = snapshot.val();
        if (contact && contact.activeCall) {
          const callerDetails = await getActiveCallerDetails(
            contact.activeCallerId,
          );
          const uniqueId = getCurrentCallId(currentCallId);
          setCurrentCallId(uniqueId);
          if (uniqueId) {
            RNCallKeep.displayIncomingCall(
              uniqueId,
              callerDetails.meetingId,
              callerDetails.name,
              'generic',
              contact.withVideo,
            );
          }
        }
      });

    return () => {
      database()
        .ref(`/contacts/${selfCallerID}`)
        .off('value', onActiveCallChange);
    };
  }, [receiverID, currentCallId]);

  async function initialiseCall(
    meetingId: string,
    isVideo: boolean = false,
  ): Promise<void> {
    try {
      const authToken = await getAuthToken(meetingId);
      await initializeWebRtc({authToken, video: isVideo});
      dispatch({type: 'SET_CALL_STATE', ringing: false, inCall: true});
    } catch (error) {
      console.error('Error initialising call:', error);
      Alert.alert(
        'Call Failed',
        'Unable to initialize the call. Please try again.',
      );
    }
  }

  async function initializeWebRtc({
    authToken,
    video,
  }: {
    authToken?: string;
    video: boolean;
  }) {
    if (initializingRef.current) {
      console.log('Initialization already in progress');
      return;
    }
    initializingRef.current = true;
    try {
      await initMeeting({
        authToken: authToken ?? 'your-default-auth-token',
        defaults: {audio: true, video: video},
      });
    } catch (error) {
      console.log('Error initializing WebRTC: ', error);
    } finally {
      initializingRef.current = false;
    }
  }

  async function getAuthToken(meetingId: string): Promise<string> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: selfName.trim(),
        meetingId: meetingId,
        presetName: 'group_call_host',
        clientSpecificId: `${Math.floor(Math.random() * 1000000)}`,
      }),
    };
    const reqResp = await fetch(
      'https://demo.dyte.io/api/v2/participants',
      options,
    );
    const meetResp = await reqResp.json();
    return meetResp.token;
  }

  async function setupCallSession(callSession: CallSession) {
    try {
      await initialiseCall(callSession.number, callSession.cameraEnabled);
    } catch (error) {
      console.log('Failed Call Setup Attempt: ', error);
    }
  }

  async function call(_number: string, video = false) {
    try {
      if (receiverID) {
        await database()
          .ref(`/contacts/${receiverID}`)
          .update({activeCall: true});
      } else {
        return;
      }
      // Start the call using RNCallKeep
      const callId = getCurrentCallId(_number);
      RNCallKeep.startCall(callId, callId, receiverName, 'generic', video);
      RNCallKeep.setCurrentCallActive(callId);
      setCurrentCallId(callId);
      await setupCallSession({number: _number, cameraEnabled: video});
    } catch (error) {
      console.error('Error during call: ', error);
    }
  }

  async function answer(uuid: string, withVideo: boolean) {
    const getSelfDetails = async (id: string) => {
      const snapshot = await database().ref(`/contacts/${id}`).once('value');
      const data = snapshot.val();
      return {name: data.name, meetingId: data.selfMeetingId};
    };
    const details = await getSelfDetails(selfCallerID);
    await initialiseCall(details.meetingId, withVideo);
  }

  async function hangup() {
    try {
      await endCall();
      await meeting?.leave();
      RNCallKeep.endAllCalls();
    } catch (e) {
      console.error(e);
    }
  }

  async function endCall() {
    try {
      if (!receiverID) {
        Alert.alert('Error', 'Receiver ID is missing.');
        return;
      }
      await database()
        .ref(`/contacts/${receiverID}`)
        .update({activeCall: false});
      await database()
        .ref(`/contacts/${selfCallerID}`)
        .update({activeCall: false});

      onCallTerminated();
    } catch (error) {
      console.error('Error ending call: ', error);
    }
  }

  function onCallTerminated() {
    dispatch({type: 'SET_CALL_STATE', ringing: false, inCall: false});
    const callId = getCurrentCallId(currentCallId);
    if (callId) {
      RNCallKeep.endCall(callId);
      RNCallKeep.endAllCalls();
      setCurrentCallId(null);
    }
  }

  function onAnswerCallAction({callUUID}: {callUUID: string}) {
    answer(callUUID, true);
  }

  function onNativeCall({handle}: {handle: string}) {
    console.log('Native call: ', handle);
  }

  function onEndCallAction() {
    hangup();
  }

  function onIncomingCallDisplayed({
    callUUID,
    handle,
    fromPushKit,
  }: {
    callUUID: string;
    handle: string;
    fromPushKit: boolean;
  }) {
    console.log(callUUID, handle, fromPushKit);
  }

  function onToggleMute(muted: boolean) {
    muted ? meeting?.self.enableAudio() : meeting?.self.disableAudio();
  }

  function onDTMF(action: string) {
    console.log('onDTMF', action);
  }

  const renderContactItem: ListRenderItem<Contact> = ({item}) => {
    const handleCall = async (video: boolean) => {
      setReceiverName(item.name);
      setReceiverID(item.id);
      await call(item.meetingId, video);
    };
    return (
      <View style={styles.contactTile}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.contactActions}>
          <Button title="Call" onPress={() => handleCall(false)} />
          <Button
            title="Video call"
            onPress={async () => await handleCall(true)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <View style={styles.formBox}>
          <Text style={styles.label}>Extension</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={value =>
              dispatch({type: 'SET_NUMBER', number: value})
            }
            value={number}
          />
        </View>

        {!ringing && !inCall && (
          <>
            <View style={styles.buttonsContainerBox}>
              <Button
                title="Call"
                disabled={!ready}
                onPress={() => call(number, false)}
              />
              <Button
                title="Video call"
                disabled={!ready}
                onPress={() => call(number, true)}
              />
            </View>
            <View style={styles.contactList}>
              <FlatList
                data={contacts}
                keyExtractor={item => item.id}
                renderItem={renderContactItem}
              />
            </View>
          </>
        )}

        {ringing && (
          <View style={styles.buttonsContainerBox}>
            <Button
              title={`Answer audio call from ${number}`}
              onPress={() => answer(currentCallId || '', false)}
            />
            <Button
              title={`Answer video call from ${number}`}
              onPress={() => answer(currentCallId || '', true)}
            />
          </View>
        )}

        {inCall && meeting && (
          <DyteProvider value={meeting}>
            <DyteUIProvider>
              <CallScreen meeting={meeting} onEnd={() => endCall()} />
            </DyteUIProvider>
          </DyteProvider>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  contentBox: {flex: 1},
  formBox: {marginBottom: 20},
  label: {fontSize: 16, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonsContainerBox: {flexDirection: 'row', justifyContent: 'space-between'},
  contactList: {marginTop: 20},
  contactTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  contactName: {fontSize: 16},
  contactActions: {flexDirection: 'row'},
});

export default Dialer;
