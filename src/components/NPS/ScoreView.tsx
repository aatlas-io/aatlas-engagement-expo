import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { normalizeFont } from '../../fontsHelper';

const ScoreView = ({
  selectedScore,
  onScoreSelect = () => {},
}: {
  selectedScore: number | undefined;
  onScoreSelect: (s: number) => void;
}) => (
  <View style={styles.container}>
    {[...Array(11).keys()].map((score) => {
      const isSelected = score === selectedScore;

      return (
        <Pressable
          key={score}
          style={[styles.scoreContainer, isSelected ? styles.selectedScoreContainer : {}]}
          onPress={() => onScoreSelect(score)}
        >
          <Text style={[styles.score, isSelected ? styles.selectedScore : {}]}>{score}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    width: 40,
    height: 32,
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    flexDirection: 'row',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  selectedScoreContainer: {
    backgroundColor: 'black',
  },
  score: {
    fontSize: normalizeFont(12),
    color: 'black',
  },
  selectedScore: {
    color: 'white',
  },
});

export default ScoreView;
