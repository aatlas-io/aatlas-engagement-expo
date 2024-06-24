/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAatlasService } from '../../context';
import { normalizeFont } from '../../fontsHelper';
import Button from '../Button';

const screenHeight = Dimensions.get('window').height;

const Announcement = ({
  titleStyle,
  messageStyle,
  containerStyle,
  buttonTitleStyle,
  buttonContainerStyle,
  onClosePress = () => {},
  showDelay = 1000,
}: {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  message?: string;
  messageStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
  onClosePress?: () => void;
  showDelay?: number;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(-screenHeight)).current;
  const { appConfig, setLastSeen } = useAatlasService();

  const onClose = async () => {
    setLastSeen({ key: 'announcement_last_seen_mobile' });
    setVisible(false);
    onClosePress();
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -screenHeight,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  useEffect(() => {
    if (appConfig?.announcement?.title && appConfig?.announcement?.message) {
      setTimeout(() => {
        setVisible(true);
      }, showDelay);
    }
  }, [showDelay, appConfig]);

  if (!appConfig?.announcement?.title && !appConfig?.announcement?.message) {
    return null;
  }

  return (
    <Modal visible animationType="none" transparent>
      <Animated.View style={[{ transform: [{ translateY }] }]}>
        <SafeAreaView style={[styles.container, containerStyle]}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title, titleStyle]}>{appConfig.announcement.title}</Text>
            <View style={{ height: 8 }} />
            <Text style={[styles.message, messageStyle]}>{appConfig.announcement.message}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Ok"
              onPress={onClose}
              titleStyle={buttonTitleStyle}
              containerStyle={[{ width: 40, backgroundColor: 'black' }, buttonContainerStyle]}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C4E0F9',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: normalizeFont(14),
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    textAlignVertical: 'center',
  },
  message: {
    fontSize: normalizeFont(12),
    textAlign: 'left',
    color: 'black',
  },
  buttonContainer: {
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Announcement;
