## Overview
TikPlayLive: Enhancing TikTok Live Streams

Goal: Increase viewer participation and retention by introducing interactive features.

Key Features:

Polls: Streamers can create live polls to engage viewers.
Mini-Games: Interactive games like Memory Match, Word Scramble, and Guess the Picture.
Betting: Viewers place bets on outcomes, adding excitement to the stream.

Technologies:
Frontend: ReactJS for cross-platform compatibility.
Backend: MongoDB Atlas for efficient data management.
Version Control: Git for streamlined collaboration.

Design Philosophy: Ensure features complement the live content without overshadowing the streamer.

## Installation

### Prerequisites

Ensure you have the following software installed on your Mac:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (optional, but recommended)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall)
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (for iOS)

### Clone the Repository

```sh
git clone <repository-url>
cd <repository-name>
```

### Install Backend Dependencies

Navigate to the backend directory and install the necessary dependencies:

```sh
cd backend
npm install
```

### Install Frontend Dependencies

Navigate to the frontend directory and install the necessary dependencies:

```sh
cd ../frontend
npm install
```

If you are using Yarn:

```sh
cd ../frontend
yarn install
```

### Install CocoaPods Dependencies (iOS only)

Navigate to the `ios` directory inside the frontend and install CocoaPods dependencies:

```sh
cd ios
pod install
cd ..
```

## Running the Project

### Start the Backend

1. Open a terminal window.
2. Navigate to the backend directory:

    ```sh
    cd backend
    ```

3. Start the backend server:

    ```sh
    node server.js
    ```

### Start the Frontend

1. Open another terminal window.
2. Navigate to the frontend directory:

    ```sh
    cd frontend
    ```

3. Start the React Native packager:

    ```sh
    npx react-native start
    ```

4. Open yet another terminal window.
5. Navigate to the frontend directory:

    ```sh
    cd frontend
    ```

6. Run the iOS application:

    ```sh
    npx react-native run-ios
    ```

### Additional Information

- Ensure your iOS simulator or device is properly set up and connected.
- If you encounter any issues, try cleaning the build and reinstalling dependencies:

    ```sh
    cd ios
    xcodebuild clean
    pod install --repo-update
    cd ..
    ```

- For more information on React Native setup and troubleshooting, refer to the [React Native documentation](https://reactnative.dev/docs/getting-started).
