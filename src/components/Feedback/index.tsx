/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAatlasService } from '../../context';
import { CLOSE_URI } from '../../constants';
import { normalizeFont } from '../../fontsHelper';
import Button, { defaultButtonContainerStyle } from '../Button';

const Feedback = ({
  feedbackRef,
  title = 'Feedback',
  placeholder = 'What would you like to share?',
  subtitle = 'Your feedback is very important to us. Please take a few minutes and leave us a feedback.',
  titleStyle,
  inputStyle,
  subtitleStyle,
  containerStyle,
  buttonTitleStyle,
  buttonContainerStyle,
  onClosePress = () => {},
}: {
  feedbackRef: React.MutableRefObject<any>;
  title?: string;
  subtitle?: string;
  placeholder?: string | '';
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
  onClosePress?: () => void;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { sendFeedback } = useAatlasService();

  const onClose = useCallback(() => {
    setIsLoading(false);
    setMessage('');
    setVisible(false);
    onClosePress();
  }, [onClosePress]);

  useEffect(() => {
    if (feedbackRef) {
      feedbackRef.current = {
        open: () => setVisible(true),
        close: onClose,
      };
    }
  }, [feedbackRef, onClose]);

  const submitFeedback = async () => {
    setIsLoading(true);
    await sendFeedback({
      message,
      type: 'general',
    });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView style={[{ flex: 1, backgroundColor: 'white' }, containerStyle]}>
        <KeyboardAwareScrollView>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
              <Image style={styles.closeImage} source={{ uri: CLOSE_URI }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              style={[styles.input, inputStyle]}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              multiline
              autoFocus
              maxLength={300}
              placeholderTextColor="#637587"
              returnKeyType="done"
              selectionColor={'black'}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit
              textAlignVertical="top"
            />
            <View style={{ height: 16 }} />
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          </View>
        </KeyboardAwareScrollView>
        <View style={defaultButtonContainerStyle}>
          <Button
            title="Submit"
            isLoading={isLoading}
            onPress={submitFeedback}
            disabled={!message}
            titleStyle={buttonTitleStyle}
            containerStyle={buttonContainerStyle}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    width: 44,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
  },
  closeImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  title: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: 'black',
  },
  headerContainer: {
    width: '100%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 180,
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    padding: 12,
    fontSize: normalizeFont(13),
    lineHeight: normalizeFont(18),
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flex: 1,
    display: 'flex',
    height: '100%',
  },
  subtitle: {
    fontSize: normalizeFont(12),
    color: '#637587',
  },
});

export default Feedback;
