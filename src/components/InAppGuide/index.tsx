/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Image, FlatList, Animated, Dimensions } from 'react-native';
import { useAatlasService } from '../../context';
import Button from '../Button';
import CarouselItem from './CarouselItem';
import Pagination from './Pagination';

const { width } = Dimensions.get('window');

const InAppGuide = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
    setVisible(!visible);
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Button containerStyle={[styles.closeButtonContainer, { left: width - 50, top: 10 }]} onPress={onClosePress}>
          <Image
            style={styles.closeImage}
            source={{
              uri: 'data:image/png;base64,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',
            }}
            resizeMode="cover"
          />
        </Button>
        <FlatList
          data={in_app_guides}
          renderItem={({ item }) => <CarouselItem item={item} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <Pagination data={in_app_guides} scrollX={scrollX} index={selectedIndex} />
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
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default InAppGuide;
