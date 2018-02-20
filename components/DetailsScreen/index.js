import React, { Component } from "react";
import {
  Animated,
  Button,
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet
} from "react-native";
import { getMeasures } from "../../utils/setStyle";
import { margin, imageHeight } from "../../utils/constants";

const { width } = Dimensions.get("window");

export default class DetailsScreen extends Component {
  nodes = {};

  animatedViewStyle = () => {
    const opacity = this.props.opacity.interpolate({
      inputRange: [0, 0.995, 0.999],
      outputRange: [0, 0, 1]
    });

    return { opacity };
  };

  animatedTextStyle = () => {
    const transform = [{ translateY: this.props.titleTranslate }];

    return { transform };
  };

  animatedContentStyle = () => {
    const transform = [{ translateY: this.props.contentTranslate }];
    return { transform };
  };

  handleOnLayout = () =>
    getMeasures({
      id: this.props.selected.id,
      nodes: this.nodes,
      callback: this.props.onLayout
    });

  render() {
    const data = this.props.selected;

    return data ? (
      <Animated.View
        style={[styles.view, StyleSheet.absoluteFill, this.animatedViewStyle()]}
      >
        <Button onPress={this.props.onPress} title="close" />
        <Animated.Text style={[styles.title, this.animatedTextStyle()]}>
          Title: {data.title}
        </Animated.Text>

        <Image
          onLayout={this.handleOnLayout}
          ref={node => (this.nodes[data.id] = node)}
          source={{ uri: data.uri }}
          style={styles.image}
        />
        <Animated.Text style={[styles.content, this.animatedContentStyle()]}>
          {data.text}
        </Animated.Text>
      </Animated.View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "black"
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    backgroundColor: "#fff"
  },
  content: {
    fontSize: 16,
    color: "black",
    margin: 10
  },
  image: { height: imageHeight, width: width - margin, borderRadius: 8 }
});
