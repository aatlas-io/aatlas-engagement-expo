import { StyleSheet, Animated, View, ScrollView, Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';

const { width } = Dimensions.get('screen');

const Pagination = ({
  data,
  scrollX,
  index,
  selectedDotColor,
  unselectedDotColor,
}: {
  data: InAppGuideItemType[];
  scrollX: Animated.Value;
  index: number;
  selectedDotColor?: string;
  unselectedDotColor?: string;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const scrollToIndex = () => {
      const dotWidth = 10; // Maximum width of the dot
      const marginHorizontal = 3;
      const totalDotWidth = dotWidth + marginHorizontal * 2;
      const totalWidth = totalDotWidth * data.length;
      const centerOffset = width / 2 - totalDotWidth / 2;

      // Calculate the position to scroll to
      let position = index * totalDotWidth - centerOffset;

      // Ensure the position does not exceed the boundaries
      if (position < 0) {
        position = 0;
      } else if (position > totalWidth - width) {
        position = totalWidth - width;
      }

      scrollViewRef.current?.scrollTo({ x: position, animated: true });
    };

    scrollToIndex();
  }, [index, data.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {data.map((_, idx) => {
          const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [12, 20, 12],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.2, 1, 0.1],
            extrapolate: 'clamp',
          });

          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [unselectedDotColor || '#808080', selectedDotColor || '#000', unselectedDotColor || '#808080'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={idx.toString()} style={[styles.dot, { width: dotWidth, backgroundColor, opacity }]} />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
