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
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAatlasService } from '../../context';
import { CLOSE_URI } from '../../constants';
import { normalizeFont } from '../../fontsHelper';
import Button from '../Button';
import ScoreView from './ScoreView';

const NPS = ({
  npsFeedbackRef,
  title = 'Rate your experience',
  header = 'How likely are you to recommend us to a friend?',
  placeholder = 'Tell us more about why you chose this score',
  titleStyle,
  headerStyle,
  inputStyle,
  inputTitle,
  inputTitleStyle,
  containerStyle,
  buttonTitleStyle,
  buttonContainerStyle,
  onClosePress = () => {},
}: {
  npsFeedbackRef: React.MutableRefObject<any>;
  title?: string;
  header?: string;
  inputTitle?: string;
  placeholder?: string | '';
  titleStyle?: StyleProp<TextStyle>;
  inputTitleStyle?: StyleProp<TextStyle>;
  headerStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
  onClosePress?: () => void;
}) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number | undefined>();
  const { sendFeedback } = useAatlasService();

  const onClose = useCallback(() => {
    setIsLoading(false);
    setMessage('');
    setVisible(false);
    onClosePress();
    setScore(undefined);
  }, [onClosePress, setScore]);

  useEffect(() => {
    if (npsFeedbackRef) {
      npsFeedbackRef.current = {
        open: () => setVisible(true),
        close: onClose,
      };
    }
  }, [npsFeedbackRef, onClose]);

  const submitFeedback = async () => {
    setIsLoading(true);
    await sendFeedback({
      message,
      type: 'nps',
      nps_score: score,
    });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView style={[{ flex: 1, backgroundColor: 'transparent' }, containerStyle]}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={styles.bottomContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ height: 10 }} />
            <View style={styles.headerContainer}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
              <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
                <Image style={styles.closeImage} source={{ uri: CLOSE_URI }} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.header, headerStyle]}>{header}</Text>
              <View style={{ height: 16 }} />
              <ScoreView selectedScore={score} onScoreSelect={(s) => setScore(s)} />
              <View style={{ height: 16 }} />
              <Text style={[styles.inputTitle, inputTitleStyle]}>{inputTitle}</Text>
              <TextInput
                style={[styles.input, inputStyle]}
                value={message}
                onChangeText={setMessage}
                placeholder={placeholder}
                multiline
                maxLength={300}
                placeholderTextColor="#637587"
                returnKeyType="done"
                selectionColor={'black'}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit
                textAlignVertical="top"
              />
              <View style={{ height: 16 }} />
              <Button
                title="Submit"
                isLoading={isLoading}
                onPress={submitFeedback}
                disabled={!score}
                titleStyle={buttonTitleStyle}
                containerStyle={buttonContainerStyle}
              />
              <View style={{ height: 20 }} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
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
    height: 150,
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    padding: 12,
    fontSize: normalizeFont(13),
    lineHeight: normalizeFont(18),
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: normalizeFont(16),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputTitle: {
    fontSize: normalizeFont(12),
    color: 'black',
    paddingBottom: 8,
  },
});

export default NPS;
