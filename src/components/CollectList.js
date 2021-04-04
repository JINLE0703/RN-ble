import React from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import CollectItem from './CollectItem';

export default function CollectList(props) {
  const {data} = props;

  const itemSeparatorComponent = () => {
    return <View style={styles.line}></View>;
  };

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <CollectItem item={item} />}
      keyExtractor={item => item.id}
      style={styles.list}
      ItemSeparatorComponent={itemSeparatorComponent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 4,
  },
  line: {
    height: 1,
    backgroundColor: '#ddd',
  },
});
