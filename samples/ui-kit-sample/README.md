## React Native UI Kit Sample App

This is a sample app made using Dyte's React Native UI Kit SDK written in Typescript and React Native.

## Steps to run

- Clone the repository  
```
git clone https://github.com/dyte-io/react-native-samples
```
- Change directory to <code>ui-kit-sample</code>  
```
cd samples
```
```
cd ui-kit-sample
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
- Create a file named <code>creds.tsx</code> inside <code>./src/secrets</code> directory.  

- Copy and paste content from <code>creds-sample.tsx</code> and replace the values with actual details  

- Run the App on
    - Android
        ```
        npm run android
        ```
    - iOS
        ```
        npm run ios
        ```