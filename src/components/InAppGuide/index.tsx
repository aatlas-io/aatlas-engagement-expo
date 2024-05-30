/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { useAatlasService } from '../../context';
import Button from '../Button';
import { normalizeFont } from '../../fontsHelper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const background_color = '';
const title_color = '';
const description_color = '';
const button_background_color = '';
const button_text_color = '';
const pagination_active_color = '';
const pagination_inactive_color = '';

const InAppGuide = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { appConfig, updateInAppGuidesSeenStatus, resetInAppGuides } =
    useAatlasService();
  const insets = useSafeAreaInsets();

  const carouselRef = useRef<ICarouselInstance | null>(null);
  const width = Dimensions.get('window').width;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const seenIdsRef = useRef<InAppGuidesStatus>({ seen: [], notSeen: [] });

  if (!appConfig?.in_app_guides?.length) {
    return null;
  }

  const { in_app_guides } = appConfig;

  const updateSeenIds = (index: number) => {
    const selectedId = in_app_guides?.[index]?.id;
    const allIds = in_app_guides.map((iag) => iag.id);
    if (selectedId) {
      if (!seenIdsRef.current.seen.includes(selectedId)) {
        seenIdsRef.current.seen.push(selectedId);
      }

      seenIdsRef.current.notSeen = allIds.filter(
        (id) => !seenIdsRef.current.seen.includes(id)
      );
    }
  };

  const updateSelectedIndex = (index: number) => {
    updateSeenIds(index);
    setSelectedIndex(index);
  };
  updateSeenIds(0);

  const headerStyle: StyleProp<TextStyle> = {
    ...styles.headerText,
    ...(title_color ? { color: title_color } : {}),
  };

  const descriptionStyle: StyleProp<TextStyle> = {
    ...styles.description,
    ...(description_color ? { color: description_color } : {}),
  };

  const renderItem = ({
    item: { title, image, description },
  }: RenderItemType) => (
    <View
      style={[
        styles.centeredView,
        {
          ...(background_color
            ? { backgroundColor: background_color }
            : undefined),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={headerStyle}>{title}</Text>
      </View>
      <View style={{ height: 12 }} />
      <Image
        style={{ width: width - 60, height: width - 60, borderRadius: 10 }}
        source={{ uri: image }}
        resizeMode="cover"
      />
      <View style={{ height: 12 }} />
      <ScrollView
        contentContainerStyle={{ width: width - 40 }}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={descriptionStyle}>{description}</Text>
      </ScrollView>
      <View style={{ height: 12 }} />
    </View>
  );

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={[
            styles.centeredView,
            {
              paddingTop: 12,
              paddingBottom: insets?.bottom ? 0 : 12,
              ...(background_color
                ? { backgroundColor: background_color }
                : undefined),
            },
          ]}
        >
          <View style={styles.closeButtonContainer}>
            <Button
              onPress={() => {
                updateSelectedIndex(0);
                updateInAppGuidesSeenStatus(seenIdsRef.current);
                seenIdsRef.current = { seen: [], notSeen: [] };
                resetInAppGuides();
                setVisible(!visible);
              }}
            >
              <Image
                style={{ width: 24, height: 24 }}
                source={{
                  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWklEQVR4nO2aYYrCMBCF361cvcWq97EwUBBl/2lP4N5y6VKIILJbmzYzZpL3Qf4V37yXTGpJAEIIIYQQQggh0ewBdADOANawYxM0B+0d3sQ3gP5h/ABoDHSboPWofcMbZr7/Z7SKuu2I7haGdCOFaIUwZn4YFxhyflHMME4J9WSC3hGGrP/oQ62V8Grm7/vPCsY0EwpbGsIU873R5jt7ac5tB83fToooFOrGvEbB7synLNyt+RQG3JtfYqQY87GvrzbyWVfIRGNFzbxGCG7NpwjBvfklIRRjfk4IxZlH7QFIzS0gNW+CUvNrUGr+IyQRxor7DpAZhooJQRYYcR+CJDDgNgRJWLi7EEShYDchiGKh2YfQ1HwwssnwaOwDhnwZL03JrRU6g5mPXQlXGLIzNp/dBQmEaynPfXiAPoccrsjc2YZ2OBmfz6+C5rDsPw11CSGEEEIIIQRF8AsxzXhib5cmdAAAAABJRU5ErkJggg==',
                }}
                resizeMode="cover"
              />
            </Button>
          </View>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            data={in_app_guides}
            onSnapToItem={updateSelectedIndex}
            renderItem={renderItem}
          />
          <View
            style={[
              styles.paginationContainer,
              background_color
                ? { backgroundColor: background_color }
                : undefined,
            ]}
          >
            <AnimatedDotsCarousel
              length={in_app_guides.length}
              currentIndex={selectedIndex}
              maxIndicators={6}
              interpolateOpacityAndColor={true}
              activeIndicatorConfig={{
                color: pagination_active_color || 'black',
                margin: 3,
                opacity: 1,
                size: 8,
              }}
              inactiveIndicatorConfig={{
                color: pagination_inactive_color || 'black',
                margin: 3,
                opacity: 0.5,
                size: 8,
              }}
              decreasingDots={[
                {
                  config: { color: 'grey', margin: 3, opacity: 0.5, size: 6 },
                  quantity: 1,
                },
                {
                  config: { color: 'grey', margin: 3, opacity: 0.5, size: 4 },
                  quantity: 1,
                },
              ]}
            />
          </View>
          <View style={{ height: 8 }} />
          <View style={styles.buttonsContainer}>
            <Button
              containerStyle={[
                styles.button,
                button_background_color
                  ? { backgroundColor: button_background_color }
                  : undefined,
              ]}
              onPress={() => {
                if (selectedIndex === in_app_guides.length - 1) {
                  updateSelectedIndex(0);
                  updateInAppGuidesSeenStatus(seenIdsRef.current);
                  seenIdsRef.current = { seen: [], notSeen: [] };
                  resetInAppGuides();
                  setVisible(!visible);
                } else {
                  carouselRef?.current?.next?.();
                }
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  button_text_color ? { color: button_text_color } : undefined,
                ]}
              >
                {selectedIndex === in_app_guides.length - 1
                  ? 'Done'
                  : 'Continue'}
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerText: {
    fontSize: normalizeFont(24),
    fontWeight: 'bold',
    fontFamily: 'Avenir',
  },
  description: {
    fontSize: normalizeFont(16),
    fontFamily: 'Avenir',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Avenir',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  paginationContainer: {
    height: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default InAppGuide;
