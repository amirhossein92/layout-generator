import PropTypes from "prop-types";
import React, { useState } from "react";

import { memoize, cloneDeep } from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import { SizeMe } from "react-sizeme";

import { bfs } from "../helper/dragHelper";
import WidgetItem from "./WidgetItem";

import "./LayoutGrid.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const breakpointRules = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const colRules = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const LayoutGrid = ({
  widgetItems,
  isEditable = true,
  editingGridColor = "#cccccc80",
  gridItemMargin = 10,
  renderView,
  renderEdit,
}) => {
  const [layouts, setLayouts] = useState({
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  });
  const [currentWidgetItem, setCurrentWidgetItem] = useState(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [nextId, setNextId] = useState(uuidv4());
  const [dropping, setDropping] = useState(false);

  const resolver = () =>
    JSON.stringify({
      layouts: layouts,
      isEditable: isEditable,
      breakpoint: currentBreakpoint,
    });

  const onDeleteById = (id) => {
    setLayouts({
      ...layouts,
      [currentBreakpoint]: layouts[currentBreakpoint].filter((q) => q.i !== id),
    });
  };

  const onUpdateById = (id, key, value) => {
    const layout = layouts[currentBreakpoint].find((q) => q.i === id);
    if (!layout) return;
    layout[key] = value;

    setLayouts({
      ...layouts,
      [currentBreakpoint]: layouts[currentBreakpoint]
        .filter((q) => q.i !== id)
        .concat(layout),
    });
  };

  const memoizedItems = memoize(() => {
    return layouts[currentBreakpoint].map(({ i, type, option, ...rest }) => (
      <div key={i} data-grid={{ i, type, option, ...rest }}>
        {isEditable
          ? renderEdit({
              type,
              option,
              id: i,
              onDeleteById,
              onUpdateById,
              ...rest,
            })
          : renderView({ type, option, id: i, ...rest })}
      </div>
    ));
  }, resolver);

  const handleDrop = (layout, item, e) => {
    const { type, option } = currentWidgetItem;
    const newLayouts = cloneDeep(layouts);
    const newItem = {
      ...item,
      type,
      option,
      isDraggable: undefined,
      isResizable: undefined,
    };
    Object.keys(newLayouts).map((size) => {
      newLayouts[size] = bfs(newLayouts[size], newItem);
      return null;
    });
    setLayouts(newLayouts);
    setNextId(uuidv4());
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
    return { ...currentWidgetItem, i: nextId };
  };

  const handleLayoutChange = (layout, nlayouts) => {
    if (dropping) {
      return;
    }

    if (layout.find(({ i }) => i === nextId)) {
      return;
    }

    const newLayouts = cloneDeep(nlayouts);
    Object.keys(newLayouts).map((size) => {
      newLayouts[size] = newLayouts[size].map((item, index) => {
        const original = layouts[size] || layouts.lg;
        return { ...original[index], ...item };
      });
      return null;
    });

    setLayouts(newLayouts);
  };

  const handleBreakpointChange = (breakpoint) =>
    setCurrentBreakpoint(breakpoint);

  const gridItemWidth = (size) => {
    return (
      Math.round((size.width - gridItemMargin) / colRules[currentBreakpoint]) -
      gridItemMargin
    );
  };

  const gridItemHeight = (size) => {
    return (
      Math.round((size.width - gridItemMargin) / colRules[currentBreakpoint]) -
      gridItemMargin
    );
  };

  const onSave = () => {
    localStorage.setItem("layouts", JSON.stringify({ layouts }));
  };

  const onLoad = () => {
    const newLayouts = JSON.parse(localStorage.getItem("layouts")).layouts;
    setLayouts(newLayouts);
  };

  const getWrapperStyle = (size) => ({
    backgroundPosition: `0 ${gridItemMargin}px`,
    backgroundSize: `${gridItemWidth(size) + gridItemMargin}px ${
      gridItemHeight(size) + gridItemMargin
    }px`,
    backgroundImage: !isEditable
      ? "none"
      : `linear-gradient(
      90deg,
      rgba(var(--palette-neutral-0, 255, 255, 255), 1) 0,
      rgba(var(--palette-neutral-0, 255, 255, 255), 1) ${gridItemMargin}px,
      rgba(232, 232, 232, 0) ${gridItemMargin}px,
      rgba(232, 232, 232, 0) ${gridItemWidth(size) + gridItemMargin}px
    ),
    linear-gradient(
      0deg,
      rgba(var(--palette-neutral-0, 255, 255, 255), 1) 0,
      rgba(var(--palette-neutral-0, 255, 255, 255), 1) ${gridItemMargin}px,
      rgba(232, 232, 232, 0) ${gridItemMargin}px,
      rgba(232, 232, 232, 0) ${gridItemHeight(size) + gridItemMargin}px
    )`,
  });

  return (
    <div className="layout-grid">
      <button onClick={onSave}>SAVE</button>
      <button onClick={onLoad}>LOAD</button>
      <div className="layout-grid__widget-items">
        {widgetItems.map((item) => (
          <WidgetItem
            key={item.type}
            widgetItem={item}
            onDragStart={(e) => handleDragStart(item, e)}
          />
        ))}
      </div>
      <SizeMe>
        {({ size }) => (
          <>
            <div
              className="layout-grid__wrapper"
              style={{
                backgroundColor: editingGridColor,
              }}
            >
              <ResponsiveReactGridLayout
                className="layout-grid__grids"
                style={getWrapperStyle(size)}
                rowHeight={gridItemHeight(size)}
                layouts={layouts}
                isDroppable={isEditable}
                isDraggable={isEditable}
                isResizable={isEditable}
                onDrop={handleDrop}
                droppingItem={getDroppingItem()}
                onLayoutChange={handleLayoutChange}
                onBreakpointChange={handleBreakpointChange}
                breakpoints={breakpointRules}
                cols={colRules}
                width={size.width}
                margin={[gridItemMargin, gridItemMargin]}
              >
                {memoizedItems()}
              </ResponsiveReactGridLayout>
            </div>
          </>
        )}
      </SizeMe>
    </div>
  );
};

LayoutGrid.propTypes = {
  renderView: PropTypes.func.isRequired,
  renderEdit: PropTypes.func.isRequired,
};

export default LayoutGrid;
