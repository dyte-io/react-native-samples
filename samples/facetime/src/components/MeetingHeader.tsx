import React from 'react';
import { View, Text } from 'react-native';
import UserAvatar from 'react-native-user-avatar';

interface MeetingHeaderProps {
  userName: string;
  userSubtitle: string;
  meeting: any;
  avatarUrl?: string; // Optional if you want to support custom avatar URLs
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  userName,
  userSubtitle,
  avatarUrl,
}) => {
  return (
    <View className="flex-row items-center p-2 m-4 border-transparent rounded-md border-1 border-gray-200">
      <UserAvatar
        size={40}
        name={userName}
        src={avatarUrl}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: 40,
          height: 40,
          borderRadius: 20, // Half of the size to make it circular
        }}
      />

      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text className="text-lg text-gray-300">{userName}</Text>
        <Text className="text-sm text-gray-400">{userSubtitle}</Text>
      </View>

      {}
      {/* <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'black',
        }}>
        <DyteClock meeting={meeting} />
      </View> */}
    </View>
  );
};

export default MeetingHeader;
