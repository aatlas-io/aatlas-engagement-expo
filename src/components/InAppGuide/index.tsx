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
  guidesRef,
  onClose = () => {},
  containerStyle,
  contentContainerStyle,
  titleStyle,
  descriptionStyle,
  selectedDotColor,
  unselectedDotColor,
  onCarouselChange = () => undefined,
}: {
  guidesRef: React.MutableRefObject<any>;
  onClose?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  selectedDotColor?: string;
  unselectedDotColor?: string;
  onCarouselChange?: (data: any) => void;
}) => {
  const { appConfig, setLastSeen } = useAatlasService();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: any) => {
    onCarouselChange(viewableItems[0]);
    setSelectedIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onClosePress = useCallback(() => {
    setLastSeen({ key: 'iag_last_seen_mobile' });
    onClose();
    setSelectedIndex(0);
  }, [onClose, setSelectedIndex, setLastSeen]);

  useEffect(() => {
    if (guidesRef) {
      guidesRef.current = {
        open: () => setVisible(true),
        close: onClosePress,
      };
    }
  }, [guidesRef, onClosePress]);

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

  if (!appConfig?.in_app_guides?.length) {
    return null;
  }

  const { in_app_guides } = appConfig;

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
