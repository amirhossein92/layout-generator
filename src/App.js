import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useState } from "react";

import LayoutGrid from "./components/LayoutGrid";
import LayoutGridItem from "./components/LayoutGridItem";
import WidgetItem from "./components/WidgetItem";

function App() {
  const widgetItems = [
    { option: { data: "b" }, type: "CHART_A", w: 1, h: 1 },
    { option: { res: "b" }, type: "CHART_B", w: 2, h: 2 },
    { option: {}, type: "WIDGET", w: 1, h: 1 },
  ];
  const [isEditable, setIsEditable] = useState(true);

  const [initialLayouts, setInitialLayouts] = useState({});
  const [tempLayouts, setTempLayouts] = useState({});

  const onLayoutChanged = (newLayouts) => {
    setTempLayouts(newLayouts);
  };

  const onSave = () => {
    localStorage.setItem("layouts", JSON.stringify({ layouts: tempLayouts }));
  };

  const onLoad = () => {
    const newLayouts = JSON.parse(localStorage.getItem("layouts")).layouts;
    setInitialLayouts(newLayouts);
  };

  return (
    <div className="App">
      <input
        type="checkbox"
        id="editable"
        name="editable"
        checked={isEditable}
        onChange={(e) => setIsEditable(e.target.checked)}
      />
      <label for="editable">Is Editable</label>
      <button onClick={onSave}>SAVE</button>
      <button onClick={onLoad}>LOAD</button>

      <LayoutGrid
        isEditable={isEditable}
        renderEdit={({ type, onUpdateById, onDeleteById, id, option }) => (
          <div>
            {type}
            {option?.data ?? ""}
            <button onClick={() => onUpdateById(id, "option", { data: "me" })}>
              Edit
            </button>
            <button onClick={() => onDeleteById(id)}>DELETE</button>
          </div>
        )}
        renderView={({ type, option }) => (
          <LayoutGridItem type={type} option={option} />
        )}
        renderDraggableItems={(handleDragStart) => (
          <div className="layout-grid__widget-items">
            {widgetItems.map((item) => (
              <WidgetItem
                key={item.type}
                widgetItem={item}
                onDragStart={(e) => handleDragStart(item, e)}
              />
            ))}
          </div>
        )}
        onChange={onLayoutChanged}
        initialLayouts={initialLayouts}
      >
        <span>Will be added here</span>
      </LayoutGrid>
    </div>
  );
}

export default App;
