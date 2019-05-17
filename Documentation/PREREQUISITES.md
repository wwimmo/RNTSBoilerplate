# PREREQUISITES

# Table of Contents

- [PREREQUISITES](#prerequisites)
- [Table of Contents](#table-of-contents)
  - [1. Native SDK Requirements](#1-native-sdk-requirements)
    - [iOS (OSX only)](#ios-osx-only)
    - [Android](#android)
    - [Windows UWP (Windows only)](#windows-uwp-windows-only)
  - [2. JS/Package Manager Requirements](#2-jspackage-manager-requirements)
  - [3. Tooling Requirements](#3-tooling-requirements)
  - [4. App Store Deployment Requirements](#4-app-store-deployment-requirements)

## 1. Native SDK Requirements

### iOS (OSX only)

-   XCode (App store or official Apple Website)
-   Command Line Tools (Open XCode, Set Build-Tools)
-   A Simulator

### Android

-   Newest Java 8 JDK
-   Install Android Studio with default settings, afterwards SDK Manager -->
    -   SDK Platforms:
        -   6.0+ Google APIs, Android SDK Platform, Google APIs System Image x86 and Atom_64 system images
    -   SDK Tools:
        -   Emulator
        -   Android SDK Platform-Tools
        -   Android SDK Tools
        -   Support Library
        -   Intel HAXM
        -   Support Repository
        -   SDK Documentation (optional)
        -   Goolge Web Driver (optional)
        -   Google Play Expansion Library (optional)
        -   Google Play Licensing Library (optional)
        -   Google Play Services (optional)
    -   Android SDK Build-Tools (Show Package details)
        -   23.0.1+
    -   Android Virtual Device (AVD):
        -   Pixel C API 27 (Android 8.1), Cold Boot instead of Quick Boot in the advanced options
        -   You can also configure a different emulator
    -   `JAVA_HOME` Umgebungsvariable setzen
    -   `ANDROID_HOME` Umgebungsvariable setzen und `%ANDROID_HOME%/tools` und `%ANDROID_HOME%/platform-tools` im Path setzen.

### Windows UWP (Windows only)

-   [Visual Studio 2017][1] or newer
-   [Windows 10 SDK Build 14393][2]
-   .Net 4.6 SDK
-   When opening the .sln file for the first time, additional packages may be required to install
-   Developer Mode has to be activated in the System Settings

[1]: https://www.visualstudio.com/downloads/
[2]: https://developer.microsoft.com/en-us/windows/downloads/sdk-archive

## 2. JS/Package Manager Requirements

-   Node.JS 8.10.0 LTS + npm 5.6.0 or newer
-   Unix only: Watchman
-   `npm i -g yarn` (we use yarn instead of npm)
-   `npm i -g react-native-cli` (react native command line tools)
-   `npm i -g typescript` (installs TypeScript)

## 3. Tooling Requirements

-   Visual Studio Code + Extensions

    -   Required:

        -   Prettier (Esben Petersen)
        -   React-Native Tools (VS Mobile Tools Team)
        -   TSLint (Microsoft)

    -   Optional:
        -   ESLint (Dirk Baeumer) (optional, we're using TSLint)
        -   Path Intellisense (Christian Kohler)
        -   npm Intellisense (Christian Kohler)
        -   Auto Close Tag (Jun Han)
        -   Auto Rename Tag (Jun Han)
        -   Auto Import (steoates)
        -   Babel ES6/ES7 (dzannotti)
        -   VS Live Share (Microsoft)
        -   React Native Snippet (Jundat95)
        -   Material Icon Theme (Philipp Kief)
        -   Bracket Pair Colorizer (CoenraadS)

## 4. App Store Deployment Requirements

-   iOS: Developer Account (Deploy to Simulator works without, to device or store it doesn't)
    -   100.-/Year
-   Android: Google Play Developer Account
    -   25fr once
    -   Business Account recommended
-   Windows Developer Account
    -   19-99 USD once
    -   Business Account recommended
