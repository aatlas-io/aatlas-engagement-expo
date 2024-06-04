/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  ScrollView,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { normalizeFont } from '../../fontsHelper';

const { width, height } = Dimensions.get('screen');

type RenderItemType = {
  item: {
    title: string;
    image: string;
    description: string;
  };
  titleStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
  contentContainerStyle: StyleProp<ViewStyle>;
};

const CarouselItem = ({
  item: { title, image, description },
  titleStyle,
  descriptionStyle,
  contentContainerStyle,
}: RenderItemType) => {
  return (
    <View style={[styles.container, contentContainerStyle]}>
      <Animated.Image
        source={{ uri: image }}
        resizeMode="contain"
        style={[styles.image, { height: width - 32, width: width - 32 }]}
      />

      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <ScrollView
          style={{ height: 100 }}
          contentContainerStyle={{ width: width - 40 }}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center',
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: normalizeFont(22),
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: normalizeFont(16),
    marginVertical: 8,
    color: 'gray',
    textAlign: 'center',
  },
  image: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
