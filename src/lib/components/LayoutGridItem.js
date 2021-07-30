import "./styles/LayoutGridItem.css";

const LayoutGridItem = ({ type, option }) => {
  const renderChildren = (type) => {
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
  };

  return <div className="layout-grid-item">{renderChildren(type)}</div>;
};

export default LayoutGridItem;
