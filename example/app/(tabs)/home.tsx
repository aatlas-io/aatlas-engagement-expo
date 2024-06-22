/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Button, View } from 'react-native';
import InAppGuide, { AatlasProvider, Feedback, NPSFeedback } from '@aatlas/engagement-expo';

export default function Home() {
  const feedbackRef = React.useRef<any>();
  const guidesRef = React.useRef<any>();

  return (
    <AatlasProvider appKey="817fd0ad-277e-497b-9fdb-ace2b53fa088" appSecret="P5fhvK_Y8d_IRUX2H7Z36l7OhWaZ6YNUV7IcJHBC">
      <NPSFeedback />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button title="Open In app guides" onPress={() => guidesRef?.current?.open?.()} />
        <InAppGuide
          guidesRef={guidesRef}
          onClose={() => {}}
          containerStyle={{}}
          titleStyle={{}}
          descriptionStyle={{}}
          unselectedDotColor=""
          selectedDotColor=""
          contentContainerStyle={{}}
          onCarouselChange={(data) => console.log(data)}
        />
        <Button title="Open feedback" onPress={() => feedbackRef?.current?.open?.()} />
        <Feedback
          feedbackRef={feedbackRef}
          title="Feedback"
          placeholder="What would you like to share?"
          subtitle="Your feedback is very important to us. Please take a few minutes and leave us a feedback."
          titleStyle={{}}
          inputStyle={{}}
          subtitleStyle={{}}
          containerStyle={{}}
          buttonTitleStyle={{}}
          buttonContainerStyle={{}}
          onClosePress={() => {}}
        />
      </View>
    </AatlasProvider>
  );
}
