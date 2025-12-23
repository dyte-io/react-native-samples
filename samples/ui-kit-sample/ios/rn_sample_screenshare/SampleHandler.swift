import RealtimeKitCore

class SampleHandler: RTKScreenshareHandler {
 override init() {
   super.init(appGroupIdentifier: "group.io.dyte.react-native", bundleIdentifier: "org.reactjs.native.example.ui-kit-sample.rn-sample-screenshare")
 }
}
