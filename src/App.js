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

  const handleDragStart = () => {};
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
      <div className="layout-grid__widget-items">
        {widgetItems.map((item) => (
          <WidgetItem
            key={item.type}
            widgetItem={item}
            onDragStart={(e) => handleDragStart(item, e)}
          />
        ))}
      </div>
      <LayoutGrid
        isEditable={isEditable}
        widgetItems={widgetItems}
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
      />
    </div>
  );
}

export default App;
