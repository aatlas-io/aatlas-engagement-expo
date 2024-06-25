import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NPS, Announcement, useAatlasService } from '@aatlas/engagement-expo';

export default function Settings() {
  const { logPageVisit } = useAatlasService();

  useEffect(() => {
    logPageVisit({ page: 'Settings' });
  }, [logPageVisit]);

  return (
    <View style={styles.container}>
      <Text>Settings tab</Text>
      <Announcement />

      <NPS
        title="Rate your experience"
        header="How likely are you to recommend us to a friend?"
        placeholder="Tell us more about why you chose this score"
        titleStyle={{}}
        headerStyle={{}}
        inputTitle="Feedback"
        inputStyle={{}}
        inputTitleStyle={{}}
        containerStyle={{}}
        buttonTitleStyle={{}}
        buttonContainerStyle={{}}
        onClosePress={() => {}}
        showDelay={2000}
        withFeedback
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
