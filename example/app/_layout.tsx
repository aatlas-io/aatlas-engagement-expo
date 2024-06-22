import React from 'react';
import { Stack } from 'expo-router/stack';
import { AatlasProvider } from '@aatlas/engagement-expo';

export default function Layout() {
  return (
    <AatlasProvider appKey="" appSecret="">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AatlasProvider>
  );
}
