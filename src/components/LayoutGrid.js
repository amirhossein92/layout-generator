import React, { useState } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";

import WidgetItem from "./WidgetItem";
import { bfs } from "../helper/dragHelper";
import RenderLayoutItem from "./RenderLayoutItem";

import "./LayoutGrid.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const LayoutGrid = ({ widgetItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [currentWidgetItem, setCurrentWidgetItem] = useState(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [nextId, setNextId] = useState(uuidv4());
  const [dropping, setDropping] = useState(false);

  const resolver = () =>
    JSON.stringify({
      layouts: layouts,
      isEditing: isEditing,
      breakpoint: currentBreakpoint,
    });

  const memoizedItems = _.memoize(() => {
    return layouts[currentBreakpoint].map(({ i, type, option }) => (
      <div key={i}>
        <div style={{ fontSize: 12 }}>id: {i}</div>
        <RenderLayoutItem type={type} option={option} />
      </div>
    ));
  }, resolver);

  const handleDrop = (layout, item, e) => {
    const { type, option } = currentWidgetItem;
    const newLayouts = _.cloneDeep(layouts);
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
    setDropping(true);
  };

  const handleDragStart = (item, e) => {
    setCurrentWidgetItem(item);
  };

  const getDroppingItem = () => {
    if (!currentWidgetItem) {
      return null;
    }
    return { ...currentWidgetItem, i: nextId };
  };

  const handleEditing = (e) => {
    setIsEditing(e.target.checked);
  };

  const handleLayoutChange = (layout, layouts) => {
    if (dropping) {
      return;
    }

    if (layout.find(({ i }) => i === nextId)) {
      return;
    }

    const newLayouts = _.cloneDeep(layouts);
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

  const pageWidth = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );

  const onSave = () => {
    localStorage.setItem("layouts", JSON.stringify({ layouts }));
  };

  const onLoad = () => {
    const newLayouts = JSON.parse(localStorage.getItem("layouts")).layouts;
    console.log(newLayouts);
    setLayouts(newLayouts);
  };

  const getWrapperStyle = () => ({
    backgroundSize: `${pageWidth / 12}px ${pageWidth / 12}px`,
  });

  return (
    <div className="layout-grid">
      <div style={{ marginBottom: 10 }}>
        <input type="checkbox" value={isEditing} onChange={handleEditing} />
        {isEditing ? "Editing" : "Not Allow To Edit"}
      </div>
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
      <ResponsiveReactGridLayout
        className="layout-grid__layouts-wrapper"
        style={getWrapperStyle()}
        rowHeight={pageWidth / 12}
        layouts={layouts}
        isDroppable={true}
        isDraggable={isEditing}
        isResizable={isEditing}
        onDrop={handleDrop}
        droppingItem={getDroppingItem()}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
      >
        {memoizedItems()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default LayoutGrid;
