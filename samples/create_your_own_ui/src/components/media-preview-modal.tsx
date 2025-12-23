import React from 'react';
import {
  RtkButton,
  RtkDialog,
  RtkIcon,
  RtkText,
  defaultIconPack,
  useLanguage,
} from '@cloudflare/realtimekit-react-native-ui';
import {useState} from 'react';
import RealtimeKitClient from '@cloudflare/realtimekit';
import {UIConfig} from '@cloudflare/realtimekit-react-native-ui';
import AudioPreview from './audio-preview';
import VideoPreview from './video-preview';
import {CustomStates, SetStates} from '../types';
import {View} from 'react-native';

function MediaPreviewModal({
  open,
  states,
  setStates,
  meeting,
  config,
}: {
  open: boolean;
  config: UIConfig;
  states: CustomStates;
  setStates: SetStates;
  meeting: RealtimeKitClient;
}) {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'none'>(
    'none',
  );
  const t = useLanguage();
  return (
    <RtkDialog
      open={open}
      onRtkDialogClose={() =>
        setStates((oldState: CustomStates) => {
          return {
            ...oldState,
            activeMediaPreviewModal: false,
          };
        })
      }
      config={config}
      hideCloseButton={false}
      meeting={meeting}
      size={'lg'}
      states={states}
      t={t}>
      <View className="m-4">
        <View className="flex flex-col">
          {activeTab !== 'none' && (
            <View className="relative px-0 py-0">
              <RtkButton
                size="sm"
                variant="secondary"
                onClick={() => setActiveTab('none')}>
                <RtkIcon icon={defaultIconPack.chevron_left} />
              </RtkButton>
            </View>
          )}
          <View className="flex justify-center items-center h-[50px]">
            <RtkText>Media Preview</RtkText>
          </View>
          {activeTab === 'none' && (
            <>
              {meeting.self.permissions.canProduceAudio === 'ALLOWED' && (
                <View className="m-1">
                  <RtkButton
                    size="sm"
                    variant="secondary"
                    kind="wide"
                    onClick={() => setActiveTab('audio')}>
                    <View className="flex flex-row">
                      <RtkText>Audio</RtkText>
                      <RtkIcon icon={defaultIconPack.mic_on} />
                    </View>
                  </RtkButton>
                </View>
              )}
              {meeting.self.permissions.canProduceVideo === 'ALLOWED' && (
                <View className="m-1">
                  <RtkButton
                    size="sm"
                    variant="secondary"
                    kind="wide"
                    onClick={() => setActiveTab('video')}>
                    <View className="flex flex-row">
                      <RtkText>Video</RtkText>
                      <RtkIcon icon={defaultIconPack.video_on} />
                    </View>
                  </RtkButton>
                </View>
              )}
            </>
          )}
          {activeTab === 'audio' && (
            <AudioPreview
              meeting={meeting}
              config={config}
              states={states}
              setStates={setStates}
            />
          )}
          {activeTab === 'video' && (
            <VideoPreview
              meeting={meeting}
              config={config}
              states={states}
              setStates={setStates}
            />
          )}
        </View>
      </View>
    </RtkDialog>
  );
}

export default MediaPreviewModal;
