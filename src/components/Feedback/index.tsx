/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Pressable,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAatlasService } from '../../context';
import { CLOSE_URI } from '../../constants';
import { normalizeFont } from '../../fontsHelper';
import CloseIcon from '../../assets/close.png';
import Button, { buttonContainerStyle } from '../Button';

const { width } = Dimensions.get('window');

const Feedback = ({
  visible,
  onClose,
  placeholder = 'What would you like to share?',
  // containerStyle,
  // contentContainerStyle,
  // titleStyle,
  // descriptionStyle,
  // selectedDotColor,
  // unselectedDotColor,
  // onCarouselChange = () => undefined,
}: {
  visible: boolean;
  onClose: () => void;
  placeholder: string | '';
  // containerStyle?: StyleProp<ViewStyle>;
  // contentContainerStyle?: StyleProp<ViewStyle>;
  // titleStyle?: StyleProp<TextStyle>;
  // descriptionStyle?: StyleProp<TextStyle>;
  // selectedDotColor?: string;
  // unselectedDotColor?: string;
  // onCarouselChange?: (data: any) => void;
}) => {
  const inputRef = useRef('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitFeedback = () => {
    // api call
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Feedback</Text>
            <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
              <Image style={styles.closeImage} source={{ uri: CLOSE_URI }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                inputRef.current = text;
              }}
              placeholder={placeholder}
              multiline
              autoFocus
              maxLength={300}
              placeholderTextColor="#637587"
              returnKeyType="done"
              selectionColor={'black'}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit
            />
            <View style={{ height: 16 }} />
            <Text style={styles.subtitle}>
              Your feedback is very important to us. Please take a few minutes and leave us a feedback.
            </Text>
          </View>
        </KeyboardAwareScrollView>
        <View style={buttonContainerStyle}>
          <Button title="Submit" isLoading={isLoading} onPress={submitFeedback} />
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
