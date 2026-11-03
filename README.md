<div align="center">

# 🧭 Expo Mapbox Navigation

**Turn-by-turn navigation for Expo apps, powered by the native Mapbox Navigation SDK.**

Drop one component into your app and get voice guidance, rerouting, traffic-aware routes and live progress events on iOS and Android.

[![npm version](https://img.shields.io/npm/v/@sargsyansevak/expo-mapbox-navigation?style=for-the-badge&color=4264fb&logo=npm)](https://www.npmjs.com/package/@sargsyansevak/expo-mapbox-navigation)
[![npm downloads](https://img.shields.io/npm/dm/@sargsyansevak/expo-mapbox-navigation?style=for-the-badge&color=4264fb)](https://www.npmjs.com/package/@sargsyansevak/expo-mapbox-navigation)
[![license](https://img.shields.io/npm/l/@sargsyansevak/expo-mapbox-navigation?style=for-the-badge&color=4264fb)](./LICENSE)

![iOS](https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat-square&logo=mapbox&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

[Install](#-installation) · [Quick start](#-quick-start) · [Props](#-props) · [Events](#-events) · [Contributing](#-for-contributors)

</div>

---

## ✨ Features

|     |                                                                         |
| --- | ----------------------------------------------------------------------- |
| 🗣️  | **Voice guidance** in the device language, or any locale you choose     |
| 🚦  | **Traffic-aware routing** with driving, walking and cycling profiles    |
| 🔀  | **Multi-stop routes** with fine control over which points are waypoints |
| 🛣️  | **Map Matching** for routes that follow your exact coordinates          |
| 🚛  | **Vehicle limits** to avoid roads too low or too narrow for your truck  |
| 🎨  | **Custom styling**: map styles, raster tile overlays, Android colors    |
| 📡  | **Live events** for progress, arrivals, reroutes and off-route          |

---

## 📦 Installation

### 1. Set up `@rnmapbox/maps`

This package builds on [`@rnmapbox/maps`](https://rnmapbox.github.io/docs/install). Install and configure it first by following their instructions.

> [!IMPORTANT]
> - Developed and tested with Mapbox Maps **`11.11.0`**. Newer versions will probably work; older ones probably won't.
> - You **must** set the version explicitly with `RNMapboxMapsVersion`. This package depends on it.
> - Remember to add your token to the config plugin **and** call `Mapbox.setAccessToken`. If you can render a plain map, you're good to go.

### 2. Install the package

```bash
npm install @sargsyansevak/expo-mapbox-navigation
```

<details>
<summary>Or install straight from GitHub</summary>

```json
"dependencies": {
  "@sargsyansevak/expo-mapbox-navigation": "github:sargsyansevak/expo-mapbox-navigation"
}
```

</details>

### 3. Configure the plugin

Add the plugin to `app.json` / `app.config.js` with your public Mapbox token (starts with `pk.`) and the same Mapbox Maps version you used for `@rnmapbox/maps`. iOS also needs static frameworks, which you can enable with `expo-build-properties`:

```json
{
  "expo": {
    "plugins": [
      [
        "@sargsyansevak/expo-mapbox-navigation",
        {
          "accessToken": "pk.YOUR_TOKEN",
          "mapboxMapsVersion": "11.11.0"
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": { "useFrameworks": "static" }
        }
      ]
    ]
  }
}
```

| Option                  | Type                     | Description                                                     |
| ----------------------- | ------------------------ | --------------------------------------------------------------- |
| `accessToken`           | `string`                 | Your public Mapbox access token (`pk.…`)                        |
| `mapboxMapsVersion`     | `string`                 | Must match the version used for `@rnmapbox/maps`                |
| `androidColorOverrides` | `Record<string, string>` | Override Android color resources used by the Mapbox UI (see below) |

<details>
<summary>🎨 Customizing Android colors</summary>

`androidColorOverrides` lets you redefine Android color resources, which is handy for restyling the built-in Mapbox components. Finding the right names takes some digging; the [Mapbox Android repo](https://github.com/mapbox/mapbox-navigation-android/blob/main/ui-components/src/main/res/values/colors-maneuver.xml) is the best place to look.

```json
[
  "@sargsyansevak/expo-mapbox-navigation",
  {
    "accessToken": "pk.YOUR_TOKEN",
    "mapboxMapsVersion": "11.11.0",
    "androidColorOverrides": {
      "mapbox_main_maneuver_background_color": "#FF0000"
    }
  }
]
```

</details>

Then rebuild your native app:

```bash
npx expo prebuild --clean
npx expo run:ios   # or run:android
```

---

## 🚀 Quick start

Once the user has granted location permission, render the view anywhere:

```tsx
import { MapboxNavigationView } from "@sargsyansevak/expo-mapbox-navigation";

export default function NavigationScreen() {
  return (
    <MapboxNavigationView
      style={{ flex: 1 }}
      coordinates={[
        { latitude: 40.1772, longitude: 44.5035 }, // start
        { latitude: 40.1872, longitude: 44.5152 }, // destination
      ]}
      onRouteProgressChanged={({ nativeEvent }) => {
        console.log(`${Math.round(nativeEvent.distanceRemaining)} m to go`);
      }}
      onCancelNavigation={() => {
        /* leave the navigation screen */
      }}
      onFinalDestinationArrival={() => console.log("You have arrived 🎉")}
    />
  );
}
```

---

## ⚙️ Props

### Route

| Prop                       | Type                                    | Default                  | Description                                                                                                                                                                                       |
| -------------------------- | --------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `coordinates` **required** | `{ latitude, longitude }[]`             | –                        | Points the route passes through. At least 2 (start and end).                                                                                                                                      |
| `waypointIndices`          | `number[]`                              | all points               | Which coordinates count as waypoints (and get a marker). Must include the first and last index.                                                                                                   |
| `useRouteMatchingApi`      | `boolean`                               | `false`                  | Build the route with the [Map Matching API](https://docs.mapbox.com/api/navigation/map-matching/) so it follows your coordinates closely.                                                         |
| `routeProfile`             | `string`                                | `mapbox/driving-traffic` | [Routing profile](https://docs.mapbox.com/api/navigation/directions/#routing-profiles). ⚠️ On Android, drop the `mapbox/` prefix.                                                                 |
| `routeExcludeList`         | `string[]`                              | –                        | Road types or locations to avoid. See the [`exclude` param](https://docs.mapbox.com/api/navigation/directions/#optional-parameters).                                                              |
| `disableAlternativeRoutes` | `boolean`                               | `false`                  | Don't calculate or show alternative routes.                                                                                                                                                       |
| `vehicleMaxHeight`         | `number`                                | –                        | Vehicle height in meters. Avoids roads with height limits.                                                                                                                                        |
| `vehicleMaxWidth`          | `number`                                | –                        | Vehicle width in meters. Avoids roads with width limits.                                                                                                                                          |

### Map & guidance

| Prop                          | Type                                     | Default       | Description                                                                                       |
| ----------------------------- | ---------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `locale`                      | `string`                                 | device locale | Language for map labels, instructions and voice.                                                  |
| `mute`                        | `boolean`                                | `false`       | Start with voice guidance muted.                                                                  |
| `mapStyle`                    | `string`                                 | Mapbox default | [Map style URL](https://docs.mapbox.com/api/maps/styles/).                                       |
| `customRasterSourceUrl`       | `string`                                 | –             | Tile URL template with `{x}`, `{y}`, `{z}`, e.g. `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| `placeCustomRasterLayerAbove` | `string`                                 | –             | Layer ID to place the custom raster layer above.                                                  |
| `initialLocation` 🍎          | `{ latitude, longitude, zoom? }`         | –             | Where the camera starts before the route loads. Zoom defaults to `15`.                            |
| `followingZoom` 🍎            | `number`                                 | –             | Camera zoom level while following the user.                                                       |
| `style`                       | `StyleProp<ViewStyle>`                   | –             | Standard view style.                                                                              |

<sub>🍎 = iOS only</sub>

### Ref methods

```tsx
const navRef = useRef<MapboxNavigationViewRef>(null);

<MapboxNavigationView ref={navRef} coordinates={coordinates} />;

navRef.current?.recenterMap(); // 🍎 iOS only
```

---

## 📡 Events

| Event                       | Payload (`nativeEvent`)                   | Fired when                                                                                         |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `onRouteProgressChanged`    | `ProgressEvent`                           | The user's progress along the route updates                                                        |
| `onCancelNavigation`        | –                                         | The cancel button is tapped. **You handle what happens next** (e.g. navigate back).               |
| `onWaypointArrival`         | `ProgressEvent` (Android) / – (iOS)       | The user reaches a waypoint                                                                        |
| `onFinalDestinationArrival` | –                                         | The user reaches the final destination                                                             |
| `onRouteChanged`            | –                                         | The route changes or the user is rerouted                                                          |
| `onUserOffRoute`            | –                                         | The user leaves the route                                                                          |
| `onRoutesLoaded`            | `{ routes: { mainRoute, alternativeRoutes } }` | Routes finish loading                                                                         |
| `onRouteFailedToLoad`       | `{ errorMessage: string }`                | The route couldn't be built                                                                        |

```ts
type ProgressEvent = {
  distanceRemaining: number; // meters
  distanceTraveled: number; // meters
  durationRemaining: number; // seconds
  fractionTraveled: number; // 0 → 1
};
```

---

## 🛠 For contributors

### Running the example app

```bash
yarn            # in the repo root
cd example
yarn
npx expo run:ios   # or run:android
```

### Updating the Mapbox SDK versions

**Android** pulls Mapbox from Gradle, so updating is just a version bump.

**iOS** is trickier. Mapbox Navigation SDK v3 ships only through Swift Package Manager (no CocoaPods yet), and there's no clean way to consume an SPM package from an Expo module. So this package bundles prebuilt `.xcframework` files instead.

> [!NOTE]
> CocoaPods support is reportedly on the way. Once it lands, this whole process can get much simpler.

<details>
<summary><b>Building the <code>.xcframework</code> files</b></summary>

<br>

1. Configure `~/.netrc` with your Mapbox credentials.
2. Clone [mapbox-navigation-ios](https://github.com/mapbox/mapbox-navigation-ios) at the version branch you want.
3. Replace its `Package.swift` with the one below, updating the versions to match the branch.
4. Run `swift build -c release`. It will fail and print the correct `navNativeChecksum`. Update the file with it, then move on (don't re-run).
5. Clone [Scipio](https://github.com/giginet/Scipio/) **inside** the mapbox-navigation-ios repo, `cd` into it and run `swift build -c release`.
6. Still inside Scipio, run:

```bash
swift run -c release scipio create ../ -f \
    --platforms iOS \
    --only-use-versions-from-resolved-file \
    --enable-library-evolution \
    --support-simulators \
    --embed-debug-symbols \
    --verbose
```

<details>
<summary>Modified <code>Package.swift</code></summary>

```swift
// swift-tools-version:5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let (navNativeVersion, navNativeChecksum) = ("324.0.0", "f7c0b81c2092faf60eea32538e630e5b67bb7d032251548a2b38054d0ede90f6")

let mapsVersion: Version = "11.11.0"
let commonVersion: Version = "24.11.0"

let mapboxApiDownloads = "https://api.mapbox.com/downloads/v2"

let package = Package(
    name: "MapboxNavigation",
    defaultLocalization: "en",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "MapboxNavigationUIKit",
            targets: ["MapboxNavigationUIKit"]
        ),
        .library(
            name: "MapboxNavigationCore",
            targets: ["MapboxNavigationCore"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/mapbox/mapbox-maps-ios.git", exact: mapsVersion),
        .package(url: "https://github.com/mapbox/mapbox-common-ios.git", exact: commonVersion),
        .package(url: "https://github.com/mapbox/turf-swift.git", exact: "4.0.0")
    ],
    targets: [
        .target(
            name: "MapboxNavigationUIKit",
            dependencies: [
                "MapboxNavigationCore",
            ],
            exclude: ["Info.plist"],
            resources: [
                .copy("Resources/MBXInfo.plist"),
                .copy("Resources/PrivacyInfo.xcprivacy")
            ]
        ),
        .target(name: "_MapboxNavigationHelpers"),
        .target(
            name: "MapboxNavigationCore",
            dependencies: [
                .product(name: "MapboxCommon", package: "mapbox-common-ios"),
                "MapboxNavigationNative",
                "MapboxDirections",
                "_MapboxNavigationHelpers",
                .product(name: "MapboxMaps", package: "mapbox-maps-ios"),
            ],
            resources: [
                .process("Resources")
            ]
        ),
        .target(
            name: "MapboxDirections",
            dependencies: [
                .product(name: "Turf", package: "turf-swift"),
            ]
        ),
        navNativeBinaryTarget(
            name: "MapboxNavigationNative",
            version: navNativeVersion,
            checksum: navNativeChecksum
        ),
    ]
)

private func navNativeBinaryTarget(name: String, version: String, checksum: String) -> Target {
    let url = "\(mapboxApiDownloads)/dash-native/releases/ios/packages/\(version)/MapboxNavigationNative.xcframework.zip"
    return .binaryTarget(name: name, url: url, checksum: checksum)
}
```

</details>

Based on [this comment](https://github.com/mapbox/mapbox-navigation-ios/issues/4703#issuecomment-2297452009) in mapbox-navigation-ios.

</details>

---

<div align="center">

MIT © [@SargsyanSevak](https://github.com/SargsyanSevak)

If this saved you time, consider giving it a ⭐ on [GitHub](https://github.com/SargsyanSevak/expo-mapbox-navigation)!

</div>
