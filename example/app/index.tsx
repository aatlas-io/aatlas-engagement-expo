/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { multiply } from '@aatlas/engagement-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, Math.random()).then(setResult);
  }, []);

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Result: {result}</Text>
      </View>
    </SafeAreaProvider>
  );
}
