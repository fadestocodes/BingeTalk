// import React, { memo, useMemo, useRef } from "react";
// import { View, FlatList, StyleSheet } from "react-native";
// import { Colors } from "../constants/Colors";

// const cellSize = 14;
// const cellMargin = 2;

// // Memoized day square
// const DayCell = memo(({ count }) => (
//   <View
//     style={[
//       styles.cell,
//       { backgroundColor: count === 1 ? Colors.secondary : Colors.primaryLight },
//     ]}
//   />
// ));

// // Memoized week column (7 days stacked vertically)
// const WeekColumn = memo(({ week }) => (
//   <View style={{ marginRight: cellMargin }}>
//     {week.map((day, index) => (
//       <DayCell key={index} count={day.count} />
//     ))}
//   </View>
// ));

// // Helper: chunk data into weeks
// const chunkIntoWeeks = (data) => {
//   const weeks = [];
//   for (let i = 0; i < data.length; i += 7) {
//     weeks.push(data.slice(i, i + 7));
//   }
//   return weeks;
// };

// const SetDaysGraph = ({ data }) => {
//   const flatListRef = useRef(null);

//   // Precompute weeks
//   const weeks = useMemo(() => chunkIntoWeeks(data), [data]);

//   return (
//     <FlatList
//       ref={flatListRef}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       data={weeks}
//       keyExtractor={(_, i) => i.toString()}
//       renderItem={({ item }) => <WeekColumn week={item} />}
//       initialNumToRender={10}
//       maxToRenderPerBatch={10}
//       windowSize={7}
//       contentContainerStyle={{ padding: 5 }}
//       onContentSizeChange={() => {
//         // Scroll to the end (most recent week) after layout is calculated
//         flatListRef.current?.scrollToEnd({ animated: false });
//       }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   cell: {
//     width: cellSize,
//     height: cellSize,
//     marginBottom: cellMargin,
//     borderRadius: 3,
//   },
// });

// export default SetDaysGraph;



import React, { memo, useMemo, useRef } from "react";
import { View, FlatList, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const cellSize = 14;
const cellMargin = 2;

// Memoized day square
const DayCell = memo(({ count }) => (
  <View
    style={[
      styles.cell,
      { backgroundColor: count === 1 ? Colors.secondary : Colors.primaryLight },
    ]}
  />
));

// Memoized week column
const WeekColumn = memo(({ week }) => (
  <View style={{ marginRight: cellMargin }}>
    {week.map((day, index) => (
      <DayCell key={index} count={day.count} />
    ))}
  </View>
));

// Helper: chunk data into groups of 7 (weeks)
const chunkIntoWeeks = (data) => {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  return weeks;
};

const SetDaysGraph = ({ data, forceFullRender = false }) => {
  const flatListRef = useRef(null);
  const scrollRef = useRef(null);

  const weeks = useMemo(() => chunkIntoWeeks(data), [data]);

  // --------------- FORCE FULL RENDER MODE (for ViewShot) ------------------
  if (forceFullRender) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{justifyContent:'flex-end', flex:1} }
          >
        {weeks.map((week, i) => (
          <WeekColumn key={i} week={week} />
        ))}
      </ScrollView>
    );
  }

  // --------------------- NORMAL APP MODE (FlatList) -----------------------
  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={weeks}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => <WeekColumn week={item} />}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
      contentContainerStyle={{ padding: 5 }}
      onContentSizeChange={() => {
        // scroll to the end (newest week)
        flatListRef.current?.scrollToEnd({ animated: false });
      }}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    marginBottom: cellMargin,
    borderRadius: 3,
  },
});

export default SetDaysGraph;
