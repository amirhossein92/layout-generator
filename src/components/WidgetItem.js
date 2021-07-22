const WidgetItem = ({ widgetItem, onDragStart }) => {
  const { type } = widgetItem;
  return (
    <div
      draggable={true}
      className="widget-item"
      key={type}
      onDragStart={onDragStart}
    >
      {type}
    </div>
  );
};

export default WidgetItem;
