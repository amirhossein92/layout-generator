# react-layout-grid-generator

[![npm package](https://img.shields.io/npm/v/react-layout-grid-generator.svg?style=flat-square)](https://www.npmjs.org/package/react-layout-grid-generator)
[![npm downloads](https://img.shields.io/npm/dt/react-layout-grid-generator.svg?maxAge=2592000)]()

this component is created using `react-grid-layout` to create dashboard by drag & drop. you can access to the [demo](https://sad-mestorf-6c159a.netlify.app).

install it with,

`yarn add react-layout-grid-generator`

or

`npm install react-layout-grid-generator`

## Options

| prop                  | type   | default   | description                                                                                                                           |
| --------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| isEditable            | bool   | false     | allow the end-user to change the position and size of the grid items.                                                                 |
| renderEdit            | func   | -         | grid item to render when edit mode is turned on, use it as a method. see below for usage                                              |
| renderView            | func   | -         | the render of grid item when edit mode is off, use it as a method                                                                     |
| onChange?             | func   | -         | the function will be raised if the layout changes in edit mode                                                                        |
| initialLayouts?       | object | null      | the initial state of layout                                                                                                           |
| renderDraggableItems? | func   | -         | to enable drag & drop components into, use it as a method. \* each draggable item 'onDragStart' should be binded to 'handleDragStart' |
| children?             | node   | null      | children will be rendered inside the `LayoutGrid`                                                                                     |
| gridItemMargin?       | number | 10        | margin between each grid item                                                                                                         |
| editingGridColor?     | string | #cccccc80 | background color in edit mode                                                                                                         |
| breakpointRules?      | object | -         | min width to apply each layout size e.g. lg, sm, lg and etc.                                                                          |
| colRules?             | object | -         | maximum number of column in width for each layout size e.g. lg, sm, lg and etc.                                                       |

### renderEdit and RenderView

in rendering the grid item you can access to the following properties:

| prop         | type   | description                                                                               |
| ------------ | ------ | ----------------------------------------------------------------------------------------- |
| id           | string | the id of grid item                                                                       |
| type         | string | it can be used as a key for rendering decision                                            |
| option       | object | it can be used as a place for storing additional data                                     |
| x            | number | row position of the grid item                                                             |
| y            | number | column position of the grid item                                                          |
| w            | number | width of each grid item                                                                   |
| h            | number | height of each grid item                                                                  |
| onUpdateById | func   | \* only in edit mode. it will update the option property. the inputs are (id, key, value) |
| onDeleteById | func   | \* only in edit mode. it will delete the grid item by id                                  |

## EXAMPLES

```js
import { LayoutGrid } from "react-layout-grid-generator";

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
  renderView={({ type, option }) => {
    switch (type) {
      case "CHART_A":
        return <div className="chart-a">CHART_A</div>;
      case "CHART_B":
        return <div className="chart-b">CHART_B</div>;
      case "WIDGET":
        return <div className="chart-c">WIDGETTTTT</div>;

      default:
        return <div className="chart-none">NO TYPE PROVIDED</div>;
    }
  }}
  renderDraggableItems={(handleDragStart) => (
    <div className="layout-grid__widget-items">
      {widgetItems.map((item) => (
        <div
          draggable={true}
          className="widget-item"
          key={item.type}
          onDragStart={(e) => handleDragStart(item, e)}
        >
          {type}
        </div>
      ))}
    </div>
  )}
  onChange={onLayoutChanged}
  initialLayouts={initialLayouts}
>
  <span>Will be added here</span>
</LayoutGrid>;
```
