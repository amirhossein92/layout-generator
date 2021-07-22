const RenderLayoutItem = ({ type, option }) => {
  switch (type) {
    case "CHART_A":
      return <div>CHART_A</div>;
    case "CHART_B":
      return <div>CHART_B</div>;
    case "WIDGET":
      return <div>WIDGETTTTT</div>;

    default:
      return <div>NO TYPE PROVIDED</div>;
  }
};

export default RenderLayoutItem;
