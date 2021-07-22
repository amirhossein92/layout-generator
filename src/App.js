import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import LayoutGrid from "./components/LayoutGrid";

function App() {
  const widgetItems = [
    { option: { data: "b" }, type: "CHART_A", w: 1, h: 1 },
    { option: { res: "b" }, type: "CHART_B", w: 2, h: 2 },
    { option: {}, type: "WIDGET", w: 1, h: 1 },
  ];

  return (
    <div className="App">
      <LayoutGrid widgetItems={widgetItems} />
    </div>
  );
}

export default App;
