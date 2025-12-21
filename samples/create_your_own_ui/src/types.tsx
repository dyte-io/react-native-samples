import {RtkSidebar, States} from '@cloudflare/realtimekit-react-native-ui';

export type CustomSideBarTabs = typeof RtkSidebar | 'warnings';

export type CustomStates = States & {
  activeMediaPreviewModal?: boolean;
  customSidebar?: CustomSideBarTabs;
};

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;
