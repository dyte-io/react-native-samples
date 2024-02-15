/* eslint-disable react-native/no-inline-styles */
import {
  DyteButton,
  DyteLogo,
  DyteText,
  DyteUIProvider,
  provideDyteDesignSystem,
  States,
  generateBackgroundColors,
  generateBrandColors,
} from '@dytesdk/react-native-ui-kit';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Meeting from './Meeting';
import {creds} from './secrets/creds';

function CreateMeeting({onCreate, colors}: {onCreate: any; colors: any}) {
  const Buffer = require('buffer').Buffer;
  const ORG_ID = creds.ORG_ID;
  const API_KEY = creds.API_KEY;
  const base64EncodedString = Buffer.from(`${ORG_ID}:${API_KEY}`).toString(
    'base64',
  );
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [errorCode, setError] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const createMeetingAndJoin = async () => {
    if (meetingTitle.trim().length === 0) {
      setError(1);
      return;
    }
    if (participantName.trim().length === 0) {
      setError(2);
      return;
    }
    try {
      // Create the Meeting
      const resp = await fetch('https://api.dyte.io/v2/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64EncodedString}`,
        },
        body: JSON.stringify({
          title: meetingTitle,
        }),
      });
      const meetingResp = await resp.json();
      const meetingCode = meetingResp.data.id;
      // Add a participant
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64EncodedString}`,
        },
        body: JSON.stringify({
          name: participantName.trim(),
          preset_name: 'group_call_host', //'group_call_host',
          custom_participant_id: `${Math.floor(Math.random() * 1000000)}`,
        }),
      };
      const addParticipantResp = await fetch(
        `https://api.dyte.io/v2/meetings/${meetingCode}/participants`,
        options,
      );
      const meetResp = await addParticipantResp.json();
      console.log(meetResp);
      onCreate({
        authToken: meetResp.data.token,
        startMeeting: true,
      });
    } catch (err: any) {
      setError(3);
      setErrorMsg(err);
    }
  };
  const showErrorCode = (_errorCode: number, error?: any) => {
    switch (_errorCode) {
      case 0:
        return null;
      case 1:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Please provide a valid meeting title
          </DyteText>
        );
      case 2:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Please provide a valid name
          </DyteText>
        );
      default:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Failed to create meeting: {error.toString()}
          </DyteText>
        );
    }
  };
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderBottomWidth: 1,
      paddingBottom: 50,
      borderColor: colors.text,
      backgroundColor: colors.background[1000],
    },
    inputField: {
      marginVertical: 10,
      width: '80%',
    },
    input: {
      height: 50,
      borderRadius: 5,
      borderWidth: 0.5,
      backgroundColor: colors.background[600],
      padding: 16,
      borderColor: colors.text,
      color: colors.text,
    },
    errorText: {
      color: colors.danger,
      marginVertical: 4,
    },
  });
  return (
    <View style={styles.container}>
      <DyteText style={{fontSize: 30}}>Create Meeting</DyteText>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          onChangeText={title => {
            setMeetingTitle(title);
          }}
          placeholder={'Meeting Title'}
          placeholderTextColor={colors.text}
          value={meetingTitle}
        />
      </View>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          onChangeText={name => {
            setParticipantName(name);
          }}
          placeholder={'Name'}
          placeholderTextColor={colors.text}
          value={participantName}
        />
      </View>
      {showErrorCode(errorCode, errorMsg)}
      <DyteButton
        onClick={() => createMeetingAndJoin()}
        size={'md'}
        variant="primary">
        <DyteText size="sm">Start Meeting</DyteText>
      </DyteButton>
    </View>
  );
}

function JoinMeeting({onJoin, colors}: {onJoin: any; colors: any}) {
  const Buffer = require('buffer').Buffer;
  const ORG_ID = creds.ORG_ID;
  const API_KEY = creds.API_KEY;
  const base64EncodedString = Buffer.from(`${ORG_ID}:${API_KEY}`).toString(
    'base64',
  );
  const [meetingCode, setMeetingCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [errorCode, setError] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const showErrorCode = (_errorCode: number, error?: any) => {
    switch (_errorCode) {
      case 0:
        return null;
      case 1:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Please provide a valid meeting code
          </DyteText>
        );
      case 2:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Please provide a valid name
          </DyteText>
        );
      default:
        return (
          <DyteText size="sm" style={styles.errorText}>
            Failed to create meeting: {error.toString()}
          </DyteText>
        );
    }
  };
  const joinMeeting = async () => {
    if (meetingCode.trim().length === 0) {
      setError(1);
      return;
    }
    if (participantName.trim().length === 0) {
      setError(2);
      return;
    }
    // Add a participant
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + base64EncodedString,
      },
      body: JSON.stringify({
        name: participantName.trim(),
        preset_name: 'group_call_host', // 'group_call_host',
        custom_participant_id: `${Math.floor(Math.random() * 1000000)}`,
      }),
    };
    try {
      const reqResp = await fetch(
        `https://api.dyte.io/v2/meetings/${meetingCode}/participants`,
        options,
      );
      const meetResp = await reqResp.json();
      onJoin({
        authToken: meetResp.data.token,
        startMeeting: true,
      });
    } catch (err: any) {
      setError(3);
      setErrorMsg(err);
    }
  };
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 16,
      borderBottomWidth: 1,
      paddingBottom: 50,
      borderColor: colors.text,
      backgroundColor: colors.background[1000],
    },
    inputField: {
      marginVertical: 10,
      width: '80%',
    },
    input: {
      height: 50,
      borderRadius: 5,
      borderWidth: 0.5,
      backgroundColor: colors.background[600],
      padding: 16,
      color: colors.text,
      borderColor: colors.text,
    },
    errorText: {
      color: colors.danger,
      marginVertical: 4,
    },
  });
  return (
    <View style={styles.container}>
      <DyteText style={{fontSize: 30}}>Join Meeting</DyteText>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          onChangeText={code => {
            setMeetingCode(code);
          }}
          placeholder={'Meeting Code'}
          placeholderTextColor={colors.text}
          value={meetingCode}
        />
      </View>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          onChangeText={name => {
            setParticipantName(name);
          }}
          placeholder={'Name'}
          placeholderTextColor={colors.text}
          value={participantName}
        />
      </View>
      {showErrorCode(errorCode, errorMsg)}
      <DyteButton onClick={joinMeeting} size={'md'} variant="primary">
        <DyteText size="sm">Join Meeting</DyteText>
      </DyteButton>
    </View>
  );
}

function ChooseTheme({onTheme, colors}: {onTheme: any; colors: any}) {
  const [theme, setTheme] = useState({
    name: 'blue',
    brand: '#2160FD',
    background: '#0B0B0B',
  });

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 16,
      marginBottom: 50,
      backgroundColor: colors.background[1000],
    },
    themeBox: {
      flexDirection: 'row',
    },
    icon: {
      borderRadius: 25,
      overflow: 'hidden',
      transform: [{rotate: '-45deg'}],
      margin: 8,
    },
    themeButtonTop: {
      height: 25,
      width: 50,
    },
    themeButtonBottom: {
      height: 25,
      width: 50,
    },
  });
  return (
    <View style={styles.container}>
      <DyteText style={{fontSize: 40}}>Choose Theme</DyteText>
      <View style={styles.themeBox}>
        <TouchableHighlight
          onPress={() => {
            setTheme({
              name: 'blue',
              brand: '#2160FD',
              background: '#0B0B0B',
            });
            onTheme('#0B0B0B');
          }}>
          <View
            style={{
              ...styles.icon,
              opacity: theme.name === 'blue' ? 1.0 : 0.5,
            }}>
            <View style={{...styles.themeButtonTop, backgroundColor: 'blue'}} />
            <View
              style={{
                ...styles.themeButtonBottom,
                backgroundColor: 'black',
              }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            setTheme({
              name: 'red',
              brand: '#FF2D2D',
              background: '#131B1F',
            });
            onTheme('#131B1F');
          }}>
          <View
            style={{
              ...styles.icon,
              opacity: theme.name === 'red' ? 1.0 : 0.5,
            }}>
            <View style={{...styles.themeButtonTop, backgroundColor: 'red'}} />
            <View
              style={{
                ...styles.themeButtonBottom,
                backgroundColor: 'black',
              }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            setTheme({
              name: 'pink',
              brand: '#F4BA99',
              background: '#FFFCF8',
            });
            onTheme('#FFFCF8');
          }}>
          <View
            style={{
              ...styles.icon,
              opacity: theme.name === 'pink' ? 1.0 : 0.5,
            }}>
            <View style={{...styles.themeButtonTop, backgroundColor: 'pink'}} />
            <View
              style={{
                ...styles.themeButtonBottom,
                backgroundColor: 'white',
              }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            setTheme({
              name: 'green',
              brand: '#75C369',
              background: '#FFFFFF',
            });
            onTheme('#FFFFFF');
          }}>
          <View
            style={{
              ...styles.icon,
              opacity: theme.name === 'green' ? 1.0 : 0.5,
            }}>
            <View
              style={{...styles.themeButtonTop, backgroundColor: 'white'}}
            />
            <View
              style={{
                ...styles.themeButtonBottom,
                backgroundColor: 'green',
              }}
            />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}

function MeetingDashboard({
  meetStates,
  meetTheme,
}: {
  meetStates: any;
  meetTheme: any;
}) {
  const {states, setStates} = meetStates;
  const {theme, setTheme} = meetTheme;
  const {colors} = useSelector(
    (state: States) => state.DyteDesign.states.designSystem,
  );
  const themes = [
    {
      name: 'blue',
      brand: '#2160FD',
      background: '#0B0B0B',
    },
    {
      name: 'red',
      brand: '#FF2D2D',
      background: '#131B1F',
    },
    {
      name: 'pink',
      brand: '#F4BA99',
      background: '#FFFCF8',
    },
    {
      name: 'green',
      brand: '#75C369',
      background: '#FFFFFF',
    },
  ];
  useEffect(() => {
    const themeObj = themes.filter(val => val.background === theme)[0];
    if (themeObj) {
      provideDyteDesignSystem({
        colors: {
          ...colors,
          brand: generateBrandColors(themeObj.brand),
          background: generateBackgroundColors(themeObj.background),
          text:
            themeObj.name === 'pink' || themeObj.name === 'green'
              ? colors.videoBg
              : '#FFFFFF',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  if (!states.startMeeting) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: theme,
        }}>
        <ScrollView
          style={{
            flex: 1,
            paddingTop: 50,
            backgroundColor: theme,
          }}>
          <DyteLogo style={{width: 100, backgroundColor: theme}} />
          <CreateMeeting
            onCreate={(config: any) => setStates(config)}
            colors={colors}
          />
          <JoinMeeting
            onJoin={(config: any) => setStates(config)}
            colors={colors}
          />
          <ChooseTheme
            onTheme={(color: any) => setTheme(color)}
            colors={colors}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <Meeting
        authToken={states.authToken}
        roomName={undefined}
        onEnded={() => {
          setStates({...states, startMeeting: false});
          setTheme('#080808');
        }}
      />
    );
  }
}

export default function () {
  const [states, setStates] = useState({
    authToken: '',
    startMeeting: false,
  });
  const [theme, setTheme] = useState('#0B0B0B');
  return (
    <DyteUIProvider>
      <MeetingDashboard
        meetStates={{states, setStates}}
        meetTheme={{theme, setTheme}}
      />
    </DyteUIProvider>
  );
}
