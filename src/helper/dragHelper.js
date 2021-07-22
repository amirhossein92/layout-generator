export const boxIntersect = (box1, box2) => {
  return (
    Math.max(box1.x, box2.x) < Math.min(box1.x + box1.w, box2.x + box2.w) &&
    Math.max(box1.y, box2.y) < Math.min(box1.y + box1.h, box2.y + box2.h)
  );
};

export const bfs = (items, newItem) => {
  const q = [newItem];
  const newLayouts = [newItem];
  const visited = {};
  while (q.length) {
    for (let size = q.length; size > 0; --size) {
      const it = q.shift();
      for (let item of items) {
        if (boxIntersect(item, it) && !visited[item.i]) {
          visited[item.i] = true;
          const pushedItem = { ...item, y: it.y + it.h };
          q.push(pushedItem);
          newLayouts.push(pushedItem);
        }
      }
    }
  }
  for (let item of items) {
    if (!visited[item.i]) {
      newLayouts.push(item);
    }
  }
  return newLayouts;
};

export const generateLayout = (items) => {
  return items.map(({ id, type, option }, i) => {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: id,
      type,
      option,
    };
  });
};
