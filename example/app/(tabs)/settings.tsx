import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NPSFeedback } from '@aatlas/engagement-expo';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text>Settings tab</Text>
      <NPSFeedback
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
