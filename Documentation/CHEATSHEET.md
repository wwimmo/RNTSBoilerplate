# CHEATSHEET

# Table of Contents
- [CHEATSHEET](#cheatsheet)
- [Table of Contents](#table-of-contents)
  - [Dependency Management](#dependency-management)
  - [Add React-Native-Windows Support](#add-react-native-windows-support)
  - [Projekt clean build](#projekt-clean-build)
  - [Link native libraries](#link-native-libraries)


## Dependency Management

| Ziel                         | Befehl                                                                     |
| ---------------------------- | -------------------------------------------------------------------------- |
| Add Dependency               | `yarn add "dependencyName"`  or  `npm i --save "dependencyName"`           |
| Add Dev-Dependency           | `yarn add --dev "dependencyName"`  or  `npm i --save-dev "dependencyName"` |
| Install Dependencies/Project | `yarn`  or  `npm install`                                                  |
| Check Deps for new versions  | `yarn outdated`                                                            |
| Update Dependencies          | `yarn upgrade`  or  `yarn upgrade-interactive`                             |

## Add React-Native-Windows Support

* `cd Path/To/MyAppName`
* `yarn add rnpm-plugin-windows --dev`
* `react-native windows`
* Open .sln file in VS 2017
    * Install additional dependecies


## Projekt clean build

* Unix only: `npm run clean-unix`
* Windows: `npm run clean`

## Link native libraries

* `react-native link "LibraryName"`
    * Attention: Sometimes linking with the above command doesn't work (mostly on windows), always do this on a clean branch!
    * If it doesn't work, follow the manual linking instructions of the library