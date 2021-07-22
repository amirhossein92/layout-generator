const RenderLayoutItem = ({ type, option }) => {
  switch (type) {
    case "CHART_A":
      return <div>CHART_A</div>;
    case "CHART_B":
      return <div>CHART_B</div>;
    case "WIDGET":
      return <div>CHART_B</div>;

    default:
      return <div>NOTHING</div>;
  }
};

export default RenderLayoutItem;
