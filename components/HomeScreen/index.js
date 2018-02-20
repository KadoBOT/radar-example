import React, { Component } from "react";
import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  View,
  StyleSheet,
  Text
} from "react-native";
import { getMeasures } from "../../utils/setStyle";
import {
  margin,
  imageHeight,
  thumbHeightAndWidth
} from "../../utils/constants";

const { width, height } = Dimensions.get("window");

export default class HomeScreen extends Component {
  nodes = {};

  handleAnimations = id => {
    const translateTitle = Animated.timing(this.props.thumbTitleTranslate, {
      toValue: width
    });

    const animation = itemId => {
      const toValue = itemId < id ? -height : height;
      let options = {
        toValue,
        useNativeDriver: true
      };

      return Animated.timing(this.props.translateY[itemId], options);
    };

    const animations = this.props.data.reduce(
      (acc, item, index) =>
        item.id !== id ? [...acc, animation(item.id)] : acc,
      []
    );

    const parallel = Animated.parallel(animations);

    Animated.sequence([translateTitle, parallel]).start(() =>
      this.props.onPress(id)
    );
  };

  animatedImageStyle = id => {
    const translateY = this.props.translateY[id];

    const transform = [{ translateY }];

    return { flexDirection: "row", alignItems: "center", transform };
  };

  animateViewStyle = () => {
    const ioRange = { inputRange: [0, 0.05, 1], outputRange: [1, 0, 0] };
    const opacity = this.props.opacity.interpolate(ioRange);

    return { opacity };
  };

  animatedTitleStyle = () => {
    const transform = {
      transform: [{ translateX: this.props.thumbTitleTranslate }]
    };

    return transform;
  };

  renderItems = item => {
    const handlePress = () => this.handleAnimations(item.id);

    const handleOnLayout = () => {
      const options = {
        id: item.id,
        nodes: this.nodes,
        callback: this.props.onLayout
      };
      return getMeasures(options);
    };

    return (
      <View key={item.id}>
        <Animated.View
          onLayout={handleOnLayout}
          style={[this.animatedImageStyle(item.id)]}
        >
          <Image
            onLayout={handleOnLayout}
            ref={node => (this.nodes[item.id] = node)}
            source={{ uri: item.uri, cache: "force-cache" }}
            style={[styles.image]}
          />
          <Animated.Text style={[styles.title, this.animatedTitleStyle()]}>
            {item.title}
          </Animated.Text>
        </Animated.View>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View
            style={[
              styles.image,
              { opacity: 0, marginTop: -thumbHeightAndWidth }
            ]}
          />
        </TouchableWithoutFeedback>
      </View>
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
    justifyContent: "flex-end",
    backgroundColor: "#fff"
  },
  image: {
    height: thumbHeightAndWidth,
    width: thumbHeightAndWidth,
    borderRadius: 8,
    marginBottom: 5
  },
  title: {
    padding: 5,
    width: "80%"
  }
});
