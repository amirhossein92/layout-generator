"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _lodash = require("lodash");

var _reactGridLayout = require("react-grid-layout");

var _uuid = require("uuid");

var _reactSizeme = require("react-sizeme");

var _dragHelper = require("../helper/dragHelper");

require("./LayoutGrid.css");

const _excluded = ["i", "type", "option"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
const breakpointRules = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};
const colRules = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};

const LayoutGrid = _ref => {
  let {
    isEditable = true,
    editingGridColor = "#cccccc80",
    gridItemMargin = 10,
    renderView,
    renderEdit,
    renderDraggableItems,
    children,
    onChange,
    initialLayouts
  } = _ref;
  const [layouts, setLayouts] = (0, _react.useState)({
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: []
  });
  (0, _react.useEffect)(() => {
    onChange && onChange(layouts);
  }, [onChange, layouts]);
  (0, _react.useEffect)(() => {
    !(0, _lodash.isEmpty)(initialLayouts) && setLayouts(initialLayouts);
  }, [initialLayouts]);
  const [currentWidgetItem, setCurrentWidgetItem] = (0, _react.useState)(null);
  const [currentBreakpoint, setCurrentBreakpoint] = (0, _react.useState)("lg");
  const [nextId, setNextId] = (0, _react.useState)((0, _uuid.v4)());
  const [dropping, setDropping] = (0, _react.useState)(false);

  const resolver = () => JSON.stringify({
    layouts: layouts,
    isEditable: isEditable,
    breakpoint: currentBreakpoint
  });

  const onDeleteById = id => {
    setLayouts(_objectSpread(_objectSpread({}, layouts), {}, {
      [currentBreakpoint]: layouts[currentBreakpoint].filter(q => q.i !== id)
    }));
  };

  const onUpdateById = (id, key, value) => {
    const layout = layouts[currentBreakpoint].find(q => q.i === id);
    if (!layout) return;
    layout[key] = value;
    setLayouts(_objectSpread(_objectSpread({}, layouts), {}, {
      [currentBreakpoint]: layouts[currentBreakpoint].filter(q => q.i !== id).concat(layout)
    }));
  };

  const memoizedItems = (0, _lodash.memoize)(() => {
    return layouts[currentBreakpoint].map(_ref2 => {
      let {
        i,
        type,
        option
      } = _ref2,
          rest = _objectWithoutProperties(_ref2, _excluded);

      return /*#__PURE__*/_react.default.createElement("div", {
        key: i,
        "data-grid": _objectSpread({
          i,
          type,
          option
        }, rest)
      }, isEditable ? renderEdit(_objectSpread({
        type,
        option,
        id: i,
        onDeleteById,
        onUpdateById
      }, rest)) : renderView(_objectSpread({
        type,
        option,
        id: i
      }, rest)));
    });
  }, resolver);

  const handleDrop = (layout, item, e) => {
    const {
      type,
      option
    } = currentWidgetItem;
    const newLayouts = (0, _lodash.cloneDeep)(layouts);

    const newItem = _objectSpread(_objectSpread({}, item), {}, {
      type,
      option,
      isDraggable: undefined,
      isResizable: undefined
    });

    Object.keys(newLayouts).map(size => {
      newLayouts[size] = (0, _dragHelper.bfs)(newLayouts[size], newItem);
      return null;
    });
    setLayouts(newLayouts);
    setNextId((0, _uuid.v4)());
    setDropping(false);
  };

  const handleDragStart = (item, e) => {
    setCurrentWidgetItem(item);
    setDropping(true);
  };

  const getDroppingItem = () => {
    if (!currentWidgetItem) {
      return null;
    }

    return _objectSpread(_objectSpread({}, currentWidgetItem), {}, {
      i: nextId
    });
  };

  const handleLayoutChange = (layout, nlayouts) => {
    if (dropping) {
      return;
    }

    if (layout.find(_ref3 => {
      let {
        i
      } = _ref3;
      return i === nextId;
    })) {
      return;
    }

    const newLayouts = (0, _lodash.cloneDeep)(nlayouts);
    Object.keys(newLayouts).map(size => {
      newLayouts[size] = newLayouts[size].map((item, index) => {
        const original = layouts[size] || layouts.lg;
        return _objectSpread(_objectSpread({}, original[index]), item);
      });
      return null;
    });
    setLayouts(newLayouts);
  };

  const handleBreakpointChange = breakpoint => setCurrentBreakpoint(breakpoint);

  const gridItemWidth = size => {
    return Math.round((size.width - gridItemMargin) / colRules[currentBreakpoint]) - gridItemMargin;
  };

  const gridItemHeight = size => {
    return Math.round((size.width - gridItemMargin) / colRules[currentBreakpoint]) - gridItemMargin;
  };

  const getWrapperStyle = size => ({
    backgroundPosition: "0 ".concat(gridItemMargin, "px"),
    backgroundSize: "".concat(gridItemWidth(size) + gridItemMargin, "px ").concat(gridItemHeight(size) + gridItemMargin, "px"),
    backgroundImage: !isEditable ? "none" : "linear-gradient(\n      90deg,\n      rgba(var(--palette-neutral-0, 255, 255, 255), 1) 0,\n      rgba(var(--palette-neutral-0, 255, 255, 255), 1) ".concat(gridItemMargin, "px,\n      rgba(232, 232, 232, 0) ").concat(gridItemMargin, "px,\n      rgba(232, 232, 232, 0) ").concat(gridItemWidth(size) + gridItemMargin, "px\n    ),\n    linear-gradient(\n      0deg,\n      rgba(var(--palette-neutral-0, 255, 255, 255), 1) 0,\n      rgba(var(--palette-neutral-0, 255, 255, 255), 1) ").concat(gridItemMargin, "px,\n      rgba(232, 232, 232, 0) ").concat(gridItemMargin, "px,\n      rgba(232, 232, 232, 0) ").concat(gridItemHeight(size) + gridItemMargin, "px\n    )")
  });

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderDraggableItems && renderDraggableItems(handleDragStart), /*#__PURE__*/_react.default.createElement("div", {
    className: "layout-grid"
  }, children, /*#__PURE__*/_react.default.createElement(_reactSizeme.SizeMe, null, _ref4 => {
    let {
      size
    } = _ref4;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "layout-grid__wrapper",
      style: {
        backgroundColor: editingGridColor
      }
    }, /*#__PURE__*/_react.default.createElement(ResponsiveReactGridLayout, {
      className: "layout-grid__grids",
      style: getWrapperStyle(size),
      rowHeight: gridItemHeight(size),
      layouts: layouts,
      isDroppable: isEditable,
      isDraggable: isEditable,
      isResizable: isEditable,
      onDrop: handleDrop,
      droppingItem: getDroppingItem(),
      onLayoutChange: handleLayoutChange,
      onBreakpointChange: handleBreakpointChange,
      breakpoints: breakpointRules,
      cols: colRules,
      width: size.width,
      margin: [gridItemMargin, gridItemMargin]
    }, memoizedItems())));
  })));
};

LayoutGrid.propTypes = {
  isEditable: _propTypes.default.bool,
  editingGridColor: _propTypes.default.string,
  gridItemMargin: _propTypes.default.number,
  renderView: _propTypes.default.func.isRequired,
  renderEdit: _propTypes.default.func.isRequired,
  renderDraggableItems: _propTypes.default.func,
  onChange: _propTypes.default.func,
  initialLayouts: _propTypes.default.array
};
var _default = LayoutGrid;
exports.default = _default;