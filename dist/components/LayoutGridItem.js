"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./styles/LayoutGridItem.css");

const LayoutGridItem = _ref => {
  let {
    type,
    option
  } = _ref;

  const renderChildren = type => {
    switch (type) {
      case "CHART_A":
        return /*#__PURE__*/React.createElement("div", {
          className: "chart-a"
        }, "CHART_A");

      case "CHART_B":
        return /*#__PURE__*/React.createElement("div", {
          className: "chart-b"
        }, "CHART_B");

      case "WIDGET":
        return /*#__PURE__*/React.createElement("div", {
          className: "chart-c"
        }, "WIDGETTTTT");

      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "chart-none"
        }, "NO TYPE PROVIDED");
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "layout-grid-item"
  }, renderChildren(type));
};

var _default = LayoutGridItem;
exports.default = _default;