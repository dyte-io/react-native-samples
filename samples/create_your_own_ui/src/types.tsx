import {DyteSidebar, States} from '@dytesdk/react-native-ui-kit';

export type CustomSideBarTabs = typeof DyteSidebar | 'warnings';

export type CustomStates = States & {
  activeMediaPreviewModal?: boolean;
  customSidebar?: CustomSideBarTabs;
};

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;
