export const getStyle = ({ measure }) => ({
  height: measure.height,
  width: measure.width,
  top: measure.py,
  left: measure.px
});

export const getMeasures = ({ id, nodes, callback }) => {
  let getNode = nodes[id].getNode
    ? nodes[id].getNode().measure
    : nodes[id].measure;

  getNode((x, y, width, height, px, py) => {
    let nativeEvent = { layout: { x, y, width, height, px, py } };
    callback({ nativeEvent, id });
  });
};
