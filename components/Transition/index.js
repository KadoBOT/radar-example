import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Easing,
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import { getStyle } from "../../utils/setStyle";

const { height, width } = Dimensions.get("window");

export default class Transition extends Component {
  componentWillReceiveProps(nextProps) {
    const { dest, source } = nextProps.position;
    if (dest && source) this.handleAnimation();
  }

  handleAnimation = () => {
    const defaultAnimation = (animated, toValue) =>
      Animated.timing(animated, {
        toValue,
        // duration: 10000,
        useNativeDriver: true
      });
    const opacityAnimation = defaultAnimation(this.props.opacity, 1);
    const titleAnimation = defaultAnimation(this.props.titleTranslate, 0);
    const contentAnimation = defaultAnimation(this.props.contentTranslate, 0);

    Animated.sequence([
      opacityAnimation,
      Animated.parallel([titleAnimation, contentAnimation])
    ]).start();
  };
  // handleDestStyle = () => getStyle({ measure: this.props.position.dest });
  handleSourceStyle = () => getStyle({ measure: this.props.position.source });
  getViewTransform = ({ dest, source }) => {
    const t = this.opacityInterpolate;

    const defaultInput = [0, 1];
    const oTY = [-21.2, dest.py - source.py + 42.4];
    const oTX = [-dest.px, (dest.width - source.width) / 2 - source.px];
    const oSY = [1, dest.height / source.height];
    const oSX = [1, dest.width / source.width];

    const translateY = t(defaultInput, oTY);
    const translateX = t(defaultInput, oTX);
    const scaleY = t(defaultInput, oSY);
    const scaleX = t(defaultInput, oSX);
    const transform = [
      { translateY },
      { translateX },
      { scaleY },
      { scaleX },
      { perspective: 1000 }
    ];

    return { transform };
  };
  getImageTransform = ({ dest }) => {
    const t = this.opacityInterpolate;
    const iSX = [0, dest.height / dest.width, 1];
    const oSX = [1.77, 1.15, 1.086];
    const scaleX = { scaleX: t(iSX, oSX) };
    const transform = [scaleX, { perspective: 1000 }];

    return { transform };
  };
  getAnimatedViewStyle = ({ dest, source }) => [
    styles.animatedView,
    this.getViewTransform({ dest, source })
  ];
  getAnimatedImageStyle = ({ dest }) => [
    styles.image,
    this.getImageTransform({ dest })
  ];
  opacityInterpolate = (inputRange, outputRange) =>
    this.props.opacity.interpolate({
      inputRange,
      outputRange
    });

  render() {
    const { dest, source } = this.props.position;
    console.log({ dest, source });
    const data = this.props.data[this.props.selected];
    return data && dest.height && source.height ? (
      <View pointerEvents="none" style={[styles.view, StyleSheet.absoluteFill]}>
        <Animated.View
          style={[
            this.handleSourceStyle(),
            this.getAnimatedViewStyle({ dest, source })
          ]}
        >
          <Animated.Image
            resizeMode="stretch"
            source={{ uri: data.uri }}
            style={this.getAnimatedImageStyle({ dest })}
          />
        </Animated.View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  view: {
    height: "100%",
    backgroundColor: "#fff"
  },
  animatedView: {
    position: "absolute",
    overflow: "hidden"
    // borderColor: "red",
    // borderWidth: 1,
    // borderStyle: "solid",
  },
  image: {
    alignSelf: "center",
    flex: 1,
    minWidth: 75
  }
});
