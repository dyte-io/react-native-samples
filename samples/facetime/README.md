## React Native UI Kit Sample App

This is a sample app made using Dyte's React Native UI Kit SDK written in Typescript and React Native.

## Steps to run

- Clone the repository  
```
git clone https://github.com/dyte-io/react-native-samples
```
- Change directory to <code>facetime</code>  
```
cd samples
```
```
cd facetime
```
- Install the dependencies
```
npm install
```
##### Note: If you face issues, try <code>npm install --legacy-peer-deps</code>

- For iOS, install the Pods
```
cd ios
pod install
```
- Open the file named <code>creds.tsx</code> inside <code>src</code> directory.  

- Copy and paste credentials from <code>Dyte Dev Portal</code> to <code>creds.tsx</code> and replace the values with actual details

- Run the App on
    - Android
        ```
        npm run android
        ```
    - iOS
        ```
        npm run ios
        ```