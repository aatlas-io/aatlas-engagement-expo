# @aatlas/engagement-expo

Enhance feature awareness and drive success with our advanced nudging platform. Aatlas is a powerful tool designed to boost engagement for your newly launched feature.

## Installation

```sh
npm install @aatlas/engagement-expo
```

or

```sh
yarn add @aatlas/engagement-expo
```

## Usage

```js
import InAppGuide, { AatlasProvider, useAatlasService } from '@aatlas/engagement';

// ...

const UserProfile = () => {
  const { setUser } = useAatlasService();

  useEffect(() => {
    setUser({
      user_id: 'XXXX',
      name: 'John Doe',
      email: 'john.doe@test.com',
    });
  }, [setUser]);

  return (
    <View>
      <Text>Set user</Text>
    </View>
  );
};

const App = () => {
  /**
   * Control when you want to show the inAppGuide
   */
  const [visible, setVisible] = useState(false);
  return (
    /**
     * Copy the 'appKey' and 'appSecret' from your Aatlas dashboard
     */
    <AatlasProvider appKey="<string>" appSecret="<string>">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button title="Open In app guide" onPress={() => setVisible(true)} />
        <InAppGuide visible={visible} setVisible={setVisible} /> // Use the InAppGuide component with the required props
        <UserProfile /> // setUser usage
      </View>
    </AatlasProvider>
  );
};
```

## Required dependencies

(Note: All required dependencies are available via expo)

- [react-native-reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [react-native-gesture-handler](https://docs.expo.dev/versions/latest/sdk/gesture-handler/)
- [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
- [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [react-native-device-info](https://docs.expo.dev/versions/latest/sdk/application/)

## License

MIT
