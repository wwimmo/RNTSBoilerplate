# README

Documentation React Native TypeScript Boilerplate project. 

# Table of Contents
- [README](#readme)
- [Table of Contents](#table-of-contents)
- [Project Documentation](#project-documentation)
  - [Prerequisites](#prerequisites)
  - [Building](#building)
  - [CheatSheet](#cheatsheet)
  - [Installation / Setup](#installation--setup)
  - [Run the project](#run-the-project)
  - [Projektstruktur](#projektstruktur)
    - [**Ordnerstruktur**](#ordnerstruktur)
- [Android/iOS/UWP OS minimal version requirement](#androidiosuwp-os-minimal-version-requirement)
  - [Android](#android)
  - [iOS](#ios)
  - [UWP](#uwp)


# Project Documentation

## Prerequisites

Check [Prerequisites](./Documentation/PREREQUISITES) for detailed information about React-Native installation.

## Building

Check [Building](./Documentation/BUILDING) for detailed information about building executables

## CheatSheet

Check [CheatSheet](./Documentation/CHEATSHEET) or package.json for some tips&tricks

## Installation / Setup

- Clone the project
- Make sure you have [Prerequisites](./Documentation/PREREQUISITES) installed
- `cd Path/To/Project`
- `yarn`

## Run the project

- `cd Path/To/Project`
- Android:
  - Start android emulator
  - `react-native run-android`
- iOS (OSX only):
  - `react-native run-ios`
- UWP (Windows only):
  - `react-native run-windows`
  - or
  - `react-native start` && open .sln in VS2017 --> Start on local machine

## Projektstruktur


### **Ordnerstruktur**

-   **_android/_**
    -   The native Android project files
    -   You usually don't touch these often
-   **_ios/_**
    -   The native Android project files
    -   You usually don't touch these often
-   **_windows/_**
    -   The native UWP project files
    -   You usually don't touch these often
-   **_node_modules/_**
    -   All npm modules will be put here (our dependencies + dependencies of dependencies)
-   **_src/_**
    -   Our workspace, our SourceCode


# Android/iOS/UWP OS minimal version requirement

## Android

* MinVersion required by React-Native: >=4.1 (API 16)

## iOS

* MinVersion required by React-Native: >=9.0

## UWP
* MinVersion: Windows 10+
