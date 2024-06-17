# @aatlas/engagement-expo

Enhance feature awareness and drive success with our advanced nudging platform. Aatlas is a powerful tool designed to boost engagement for your newly launched feature.

## Installation

---

```sh
npm install @aatlas/engagement-expo
```

or

```sh
yarn add @aatlas/engagement-expo
```

## Usage

---

##### App setup

```js
import InAppGuide, { AatlasProvider, useAatlasService } from '@aatlas/engagement-expo';

// ...

const App = () => {
  return (
    /**
     * Copy the 'appKey' and 'appSecret' from your Aatlas dashboard
     */
    <AatlasProvider appKey="<string>" appSecret="<string>">
      //...
    </AatlasProvider>
  );
};
```

##### User setup

> We recommend to set up the user with the required <b>`user_id`</b> field to correctly identify their interactions. By default a user is identified using a random uuid and without the <b>`user_id`</b> their info will be removed periodically.

```js
const UserProfile = () => {
  const { setUser } = useAatlasService();
  // ...

  useEffect(() => {
    setUser({
      user_id: userId,
      name: name,
      email: email,
    });
  }, [setUser, userId, name, email]);

  // ...
};
```

##### Using In App Guides

```js
const Home = () => {
  const guidesRef = React.useRef<any>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open In app guide" onPress={() => guidesRef?.current?.open?.()} />
      <InAppGuide
        guidesRef={guidesRef}
        onClose={() => {}} // optional
        containerStyle={{}} // optional
        contentContainerStyle={{}} // optional
        titleStyle={{}} // optional
        descriptionStyle={{}} // optional
        onCarouselChange={(data) => console.log(data)} // optional
        selectedDotColor="" // optional
        unselectedDotColor="" // optional
      />
    </View>
  );
};
```

##### Using Feedback

```js
const Home = () => {
  const feedbackRef = React.useRef<any>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Feedback" onPress={() => feedbackRef?.current?.open?.()} />
      <Feedback
        feedbackRef={feedbackRef}
        title={''} // optional
        placeholder={''} // optional
        subtitle={''} // optional
        titleStyle={{}} // optional
        inputStyle={{}} // optional
        subtitleStyle={{}} // optional
        containerStyle={{}} // optional
        buttonTitleStyle={{}} // optional
        buttonContainerStyle={{}} // optional
        onClosePress={() => {}} // optional
      />
    </View>
  );
};
```

## Required dependencies

(Note: All required dependencies are available via expo)

- [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- [expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/)

## License

MIT
