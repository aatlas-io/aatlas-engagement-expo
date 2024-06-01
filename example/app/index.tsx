/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Button, View } from 'react-native';
import 'react-native-gesture-handler';
import InAppGuide, { AatlasProvider, useAatlasService } from '@aatlas/engagement-expo';

const UserProfile = () => {
  const { setUser } = useAatlasService();

  React.useEffect(() => {
    setUser({
      user_id: '12345',
      name: 'Dave roe',
      email: 'dave.roe@test.com',
    });
  }, [setUser]);

  return null;
};

export default function Index() {
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <AatlasProvider appKey="" appSecret="">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button title="Open In app guide" onPress={() => setVisible(true)} />
        <InAppGuide visible={visible} setVisible={setVisible} />
        <UserProfile />
      </View>
    </AatlasProvider>
  );
}
