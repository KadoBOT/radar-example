import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  View,
  StyleSheet,
  Text
} from "react-native";
import { getMeasures } from "../../utils/setStyle";

const { height } = Dimensions.get("window");

export default class HomeScreen extends Component {
  nodes = {};

  handleAnimations = id => {
    const animation = itemId =>
      Animated.timing(this.props.translateY[itemId], {
        toValue: itemId < id ? -height : height,
        useNativeDriver: true
      });

    const animations = this.props.data.reduce(
      (acc, item, index) =>
        item.id !== id ? [...acc, animation(item.id)] : acc,
      []
    );

    Animated.parallel(animations).start(() => this.props.onPress(id));
  };

  animatedImageStyle = id => {
    const translateY = this.props.translateY[id];
    const transform = [{ translateY }, { perspective: 1000 }];

    return { transform };
  };

  animateViewStyle = () => {
    const opacity = this.props.opacity.interpolate({
      inputRange: [0, 0.05, 1],
      outputRange: [1, 0, 0]
    });

    return { opacity };
  };

  renderItems = item => {
    const handlePress = () => this.handleAnimations(item.id);

    const handleOnLayout = () =>
      getMeasures({
        id: item.id,
        nodes: this.nodes,
        callback: this.props.onLayout
      });

    return (
      <TouchableHighlight key={item.id} onPress={handlePress}>
        <Animated.View
          onLayout={handleOnLayout}
          style={[this.animatedImageStyle(item.id)]}
        >
          <Image
            onLayout={handleOnLayout}
            ref={node => (this.nodes[item.id] = node)}
            source={{ uri: item.uri }}
            style={[styles.image]}
          />
        </Animated.View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <Animated.View style={[styles.view, this.animateViewStyle()]}>
        {/*<FlatList data={this.props.data} keyExtractor={(item) => item.id} renderItem={this.renderItems}/>*/}
        {this.props.data.map(item => this.renderItems(item))}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: "flex-start",
    justifyContent: "flex-end"
  },
  image: {
    height: 75,
    width: 75
  }
});
