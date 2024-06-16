import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { normalizeFont } from '../../fontsHelper';

const Button = ({
  title,
  onPress,
  isLoading,
  titleStyle,
  containerStyle,
}: {
  title: string;
  onPress: () => void;
  isLoading: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}) => (
  <Pressable onPress={onPress} style={[styles.button, containerStyle]} disabled={isLoading}>
    {isLoading ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Text style={[styles.buttonTitle, titleStyle]}>{title}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 40,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: normalizeFont(12),
    fontWeight: 'bold',
  },
});

export const buttonContainerStyle = styles.buttonContainer;

export default Button;
