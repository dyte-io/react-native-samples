import React from 'react';
import {
  DyteButton,
  DyteDialog,
  DyteIcon,
  DyteText,
  defaultIconPack,
  useLanguage,
} from '@dytesdk/react-native-ui-kit';
import {useState} from 'react';
import DyteClient from '@dytesdk/web-core';
import {UIConfig} from '@dytesdk/react-native-ui-kit';
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
  meeting: DyteClient;
}) {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'none'>(
    'none',
  );
  const t = useLanguage();
  return (
    <DyteDialog
      open={open}
      onDyteDialogClose={() =>
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
              <DyteButton
                size="sm"
                variant="secondary"
                onClick={() => setActiveTab('none')}>
                <DyteIcon icon={defaultIconPack.chevron_left} />
              </DyteButton>
            </View>
          )}
          <View className="flex justify-center items-center h-[50px]">
            <DyteText>Media Preview</DyteText>
          </View>
          {activeTab === 'none' && (
            <>
              {meeting.self.permissions.canProduceAudio === 'ALLOWED' && (
                <View className="m-1">
                  <DyteButton
                    size="sm"
                    variant="secondary"
                    kind="wide"
                    onClick={() => setActiveTab('audio')}>
                    <View className="flex flex-row">
                      <DyteText>Audio</DyteText>
                      <DyteIcon icon={defaultIconPack.mic_on} />
                    </View>
                  </DyteButton>
                </View>
              )}
              {meeting.self.permissions.canProduceVideo === 'ALLOWED' && (
                <View className="m-1">
                  <DyteButton
                    size="sm"
                    variant="secondary"
                    kind="wide"
                    onClick={() => setActiveTab('video')}>
                    <View className="flex flex-row">
                      <DyteText>Video</DyteText>
                      <DyteIcon icon={defaultIconPack.video_on} />
                    </View>
                  </DyteButton>
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
    </DyteDialog>
  );
}

export default MediaPreviewModal;
