import React from 'react';
import { Text, TouchableHighlight } from 'react-native';

interface MeetingTileProps {
  meeting: any;
  onClick: (newState: any) => void;
}

const MeetingTile: React.FC<MeetingTileProps> = ({ meeting, onClick }) => {
  return (
    <TouchableHighlight
      className="flex-row items-center p-4 bg-white border-b border-gray-200"
      onPress={() => onClick(meeting)}
      underlayColor="#6B7280">
      <>
        <Text className="flex-1 text-lg text-gray-800">{meeting.title}</Text>
        <Text className="text-sm text-gray-600">{meeting.updated_at}</Text>
      </>
    </TouchableHighlight>
  );
};

export default MeetingTile;
