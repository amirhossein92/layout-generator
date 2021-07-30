"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const WidgetItem = _ref => {
  let {
    widgetItem,
    onDragStart
  } = _ref;
  const {
    type
  } = widgetItem;
  return /*#__PURE__*/React.createElement("div", {
    draggable: true,
    className: "widget-item",
    key: type,
    onDragStart: onDragStart
  }, type);
};

var _default = WidgetItem;
exports.default = _default;