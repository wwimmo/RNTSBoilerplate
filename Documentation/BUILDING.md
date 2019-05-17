# BUILDING

Documentation of the Build-Process for Android, iOS and UWP.
The Build-Process can be automated with a script or CI-Tool.

# Table of Contents

- [BUILDING](#building)
- [Table of Contents](#table-of-contents)
- [Android Build-Pipeline](#android-build-pipeline)
  - [Test/Debug Build-Pipeline](#testdebug-build-pipeline)
  - [Production/Release Build-Pipeline](#productionrelease-build-pipeline)
    - [Prepare Release Signing](#prepare-release-signing)
    - [Release Build Prozess](#release-build-prozess)
    - [Decrease APK Size](#decrease-apk-size)
- [iOS Build-Pipeline](#ios-build-pipeline)
    - [Prepare Signing (multiple Targets, Schemes and .plist)](#prepare-signing-multiple-targets-schemes-and-plist)
    - [Build Process (multiple Targets, Schemes and .plist)](#build-process-multiple-targets-schemes-and-plist)
- [UWP Build-Pipeline](#uwp-build-pipeline)
  - [Test/Debug Build-Pipeline](#testdebug-build-pipeline-1)
  - [Production/Release Build-Pipeline](#productionrelease-build-pipeline-1)
    - [Prepare Release Signing](#prepare-release-signing-1)
    - [Release Build Prozess](#release-build-prozess-1)

# Android Build-Pipeline

Describes the Build-Process for Android Debug and Android Release.

## Test/Debug Build-Pipeline

In the case of debug, the app will be signed with the debug keystore located at `android/keystores/debug.keystore.properties`

1.  Clone/Pull the project and install it with : `npm install` oder `yarn`
2.  Execute (at root of the project):
    1.  `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
3.  `cd android/ && ./gradlew assembleDebug`
4.  app-debug.apk will be saved to `android/app/build/outputs/apk`
5.  In order to install it on a device you have to enable `Unknown Source` in `Settings --> Security`

## Production/Release Build-Pipeline

### Prepare Release Signing

1.  Create a release signing keystore
    1.  HowTo: [Android App Signing from Google](https://developer.android.com/tools/publishing/app-signing.html) and [React-Native Android App Signing](https://facebook.github.io/react-native/docs/signed-apk-android.html)
    2.  `keytool -genkey -v -keystore my-release-key-name.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000` (valid for ~25 years)
        1.  DO NOT COMMIT TO VCS && BUT BACKUP! Once lost, you cannot update your App anymore, you have to create a new store listing with different package name
2.  Save release signing keystore on Build-Server
3.  The Keystore password is needed while building and can be saved in two or three ways: PlainText or in a Keychain
    1.  PlainText in the project is a bad option due to security
    2.  A Keychain ist preferable, here an example with the OSX Keychain: [Safer Passwords in Android Build](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)
    3.  The third option saves the below mentioned (Point 4) variables as PlainText in a seperate file which is not included in the project/repository and reads it in `android/app/build.gradle`, Example: [Remove signing information from your build files](https://developer.android.com/studio/publish/app-signing).
4.  Adapt `android/gradle.properties`
    1.  Add `MYAPP_RELEASE_STORE_FILE=path/to/my-release-key-name.keystore` (naming is up to you)
    2.  Add `MYAPP_RELEASE_KEY_ALIAS=my-key-alias` (naming is up to you)
    3.  PlainText only: Add `MYAPP_RELEASE_STORE_PASSWORD=PasswordInPlainText` (naming is up to you)
    4.  PlainText only: Add `MYAPP_RELEASE_KEY_PASSWORD=PasswordInPlainText` (naming is up to you)
5.  Add signing config in `android/app/build.gradle`
    1.  PlainText Keystore Passwort: [React-Native Android App Signing](https://facebook.github.io/react-native/docs/signed-apk-android.html)
    2.  Keychain: Read password as described on [Safer Passwords in Android Build](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)

### Release Build Prozess

1.  _ONCE ONLY_: The above mentioned `Prepare Release Signing` process has to be done once
2.  Clone/Pull project and install with `npm install` or `yarn`
3.  `cd android/ && ./gradlew assembleRelease`
4.  app-release.apk will be saved to `android/app/build/outputs/apk/`
5.  Upload App to Play-Store and configure store listing

### Decrease APK Size

1.  Seperate built .apks by CPU-Architecture: `def enableSeparateBuildPerCPUArchitecture = true` in `android/app/build.gradle`
2.  Activate ProGuard: `def enableProguardInReleaseBuilds = true` in `android/app/build.gradle` (test well afterwards!)

# iOS Build-Pipeline

Describes the Build-Process for iOS Debug and iOS Release.
I recommend to create multiple Build-Targets, Schemes and .plist Files for Dev/Test/Prod in order to simplify the Build-Process in the end.
Certificates & Profiles can be XCode/Automatically managed.

### Prepare Signing (multiple Targets, Schemes and .plist)

1.  Login with Developer Account on [Apple Developer](apple.developer.com)
2.  Open Certificates, Identifiers & Profiles
    1.  Create Certificates
        1.  1x iOS App Development for Dev
        2.  1x App Store for Prod
        3.  1x Ad Hoc for Test
    2.  Create App ID (Explicit Typ)
    3.  Create Provisioning Profiles
        1.  1x iOS App Development for Dev Build Scheme
        2.  1x Ad Hoc for Test Build Scheme
        3.  1x App Store for Prod Build Scheme
3.  Open project in XCode, open settings --> Choose Account Tab
4.  Login with Apple Developer Account
5.  Codesignierung konfigurieren:
    1.  Projekt auswählen
    2.  Duplicate existing target twice and rename it (z.b. myApp-dev, myApp-test, myApp)
        1.  Search for "Signing" in the "General"-Tab
        2.  Deactivate "Automatically manage signing" ?
        3.  Configure Signing manually (prod-profile, test-profile, dev-profile) ?
    3.  Duplicate Scheme and adapt
        1.  Adapt Configuration to "Release"
    4.  Rename duplicated Info.plist files and set in targets
6.  Open AppDelegate.m and add a `#ifdef DEBUG #else #endif`
    1.  If debug, use existing `jscodelocation`
    2.  If not debug use `jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`

### Build Process (multiple Targets, Schemes and .plist)

1.  Dev:
    1.  Build: `xcodebuild -workspace ios/myApp.xcodeproj/ -scheme myApp-dev -sdk iphoneos -configuration Release OTHER_CODE_SIGN_FLAGS="--keychain /Users/tstein/Library/Keychains/login.keychain" archive -archivePath ios/build/dev.xcarchive`
    2.  Archive: `xcodebuild -exportArchive -archivePath ios/build/dev.xcarchive -exportOptionsPlist ios/exportOptions-dev.plist -exportPath ios/build/exportedArchives/dev/`
2.  Test:
    1.  Build: `xcodebuild -workspace ios/myApp.xcodeproj/ -scheme myApp-test -sdk iphoneos -configuration Release OTHER_CODE_SIGN_FLAGS="--keychain /Users/tstein/Library/Keychains/login.keychain" archive -archivePath ios/build/test.xcarchive`
    2.  Archive: `xcodebuild -exportArchive -archivePath ios/build/test.xcarchive -exportOptionsPlist ios/exportOptions-test.plist -exportPath ios/build/exportedArchives/test/`
3.  Prod:
    1.  Build: `xcodebuild -workspace ios/myApp.xcodeproj/ -scheme myApp -sdk iphoneos -configuration Release OTHER_CODE_SIGN_FLAGS="--keychain /Users/tstein/Library/Keychains/login.keychain" archive -archivePath ios/build/wap3.xcarchive`
    2.  Archive: `xcodebuild -exportArchive -archivePath ios/build/wap3.xcarchive -exportOptionsPlist ios/exportOptions.plist -exportPath ios/build/exportedArchives/prod/`
4.  [iOS Build from Command-Line](https://medium.com/xcblog/xcodebuild-deploy-ios-app-from-command-line-c6defff0d8b8)

# UWP Build-Pipeline

Describes the Build-Process for UWP Debug and UWP Release.

## Test/Debug Build-Pipeline

In the case of debug, the app will be signed with the debug certificate which is located at the root of the `windows/` folder (`myapp_TemporaryKey.pfx`).

1.  Clone/Pull project and install with: `npm install` oder `yarn`
2.  Execute (at root of the project):
    1.  `react-native bundle --platform windows --dev false --entry-file index.js --bundle-output windows/myApp/ReactAssets/index.windows.bundle --assets-dest windows/myApp/ReactAssets` (Check paths)
3.  Open VS2017 and execute DebugBundle App
4.  Rightclick on sub-project (not project map)
    1.  Store --> Create App-Packages (for Sideloading)
5.  Installation files will be saved to `myapp/windows/myapp/AppPackages/versionsName`
6.  The Developer mode has to be activated and the unsigned certificate has to be installed. Use the `Add-AppDevPackage.ps1` script for that.

## Production/Release Build-Pipeline

In the case of release, the app will be signed with a release certificate which you have to provide in `Package.appxmanifest`.

### Prepare Release Signing

1.  Create signing key (https://docs.microsoft.com/en-us/windows/uwp/packaging/packaging-uwp-apps)

### Release Build Prozess

1.  Clone/Pull the project and install with: `npm install` or `yarn`
2.  Execute (at root of the project):
    1.  `react-native bundle --platform windows --dev false --entry-file index.js --bundle-output windows/myapp/ReactAssets/index.windows.bundle --assets-dest windows/myapp/ReactAssets`
3.  Open VS2017 and execute ReleaseBundle App
4.  Open `Package.appxmanifest` and verify that the correct certificate is used for signing
5.  Rightclick on the sub-project (not project map)
    1.  Store --> Create App-Packages (for MS Store)
6.  Installation files will be saved to `myapp/windows/myapp/AppPackages/versionsName`
7.  Execute `Windows App Certification Kit`
8.  Upload to MS-Store and configure store listing
