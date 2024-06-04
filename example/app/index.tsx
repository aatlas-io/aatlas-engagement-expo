/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Button, View } from 'react-native';
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
  const [visible, setVisible] = React.useState<boolean>(false);
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
        <InAppGuide
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          containerStyle={{}}
          titleStyle={{}}
          descriptionStyle={{}}
          unselectedDotColor=""
          selectedDotColor=""
          contentContainerStyle={{}}
          onCarouselChange={(data) => console.log(data)}
        />
        <UserProfile />
      </View>
    </AatlasProvider>
  );
}
