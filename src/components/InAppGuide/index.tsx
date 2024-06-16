/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAatlasService } from '../../context';
import CarouselItem from './CarouselItem';
import Pagination from './Pagination';
import { CLOSE_URI } from '../../constants';

const { width } = Dimensions.get('window');

const InAppGuide = ({
  visible,
  onClose,
  containerStyle,
  contentContainerStyle,
  titleStyle,
  descriptionStyle,
  selectedDotColor,
  unselectedDotColor,
  onCarouselChange = () => undefined,
}: {
  visible: boolean;
  onClose: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  selectedDotColor?: string;
  unselectedDotColor?: string;
  onCarouselChange?: (data: any) => void;
}) => {
  const { appConfig, updateInAppGuidesSeenStatus, resetInAppGuides } = useAatlasService();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const seenIdsRef = useRef<InAppGuidesStatus>({ seen: [], notSeen: [] });
  const scrollX = useRef(new Animated.Value(0)).current;

  const updateSeenIds = useCallback(
    (index: number) => {
      const selectedId = appConfig?.in_app_guides?.[index]?.id;
      const allIds = appConfig?.in_app_guides?.map((iag) => iag.id) || [];
      if (selectedId) {
        if (!seenIdsRef.current.seen.includes(selectedId)) {
          seenIdsRef.current.seen.push(selectedId);
        }

        seenIdsRef.current.notSeen = allIds?.filter((id) => !seenIdsRef.current.seen.includes(id));
      }
    },
    [appConfig?.in_app_guides]
  );

  const updateSelectedIndex = (index: number) => {
    updateSeenIds(index);
    setSelectedIndex(index);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: any) => {
    onCarouselChange(viewableItems[0]);
    updateSelectedIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    updateSeenIds(selectedIndex);
  }, [selectedIndex, updateSeenIds]);

  if (!appConfig?.in_app_guides?.length) {
    return null;
  }

  const { in_app_guides } = appConfig;

  const onClosePress = () => {
    updateInAppGuidesSeenStatus(seenIdsRef.current);
    seenIdsRef.current = { seen: [], notSeen: [] };
    resetInAppGuides();
    onClose();
    setSelectedIndex(0);
  };

  const handleOnScroll = (event: any) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <SafeAreaView style={[{ flex: 1, backgroundColor: 'white' }, containerStyle]}>
        <TouchableOpacity style={[styles.closeButtonContainer, { left: width - 50, top: 10 }]} onPress={onClosePress}>
          <Image style={styles.closeImage} source={{ uri: CLOSE_URI }} resizeMode="cover" />
        </TouchableOpacity>
        <FlatList
          data={in_app_guides}
          renderItem={({ item }) => (
            <CarouselItem item={item} {...{ contentContainerStyle, titleStyle, descriptionStyle }} />
          )}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <Pagination
          data={in_app_guides}
          scrollX={scrollX}
          index={selectedIndex}
          {...{ selectedDotColor, unselectedDotColor }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImage: {
    width: 24,
    height: 24,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default InAppGuide;
