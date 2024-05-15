export const SET_MODE = 'SET_MODE';
export const DRAG = 'DRAG';
export const DRAG_HANDLE = 'DRAG_HANDLE';
export const DRAG_HANDLE_STOP = 'DRAG_HANDLE_STOP';
export const DOUBLE_CLICK_HANDLE = 'DOUBLE_CLICK_HANDLE';
export const MOUSE_MOVE = 'MOUSE_MOVE';
export const DRAG_POTENTIAL_POINT = 'DRAG_POTENTIAL_POINT';
export const DRAG_POTENTIAL_POINT_STOP = 'DRAG_POTENTIAL_POINT_STOP';
export const DRAG_INDICATOR = 'DRAG_INDICATOR';

export function reducer(state, action) {
  switch (action.type) {
    case SET_MODE:
      if (action.value === state.mode) {
        return state;
      }
      else if (action.value === 'rect') {
        return {
          ...state,
          mode: 'rect',
          previousPolygonPoints: state.points,
          points: getBoundingBox(state.points)
        };
      }
      else {
        return {
          ...state,
          mode: 'polygon',
          points: state.previousPolygonPoints || state.points
        };
      }
    case DRAG:
      let [deltaX, deltaY] = action.delta;

      state.points.forEach(point => {
        if (point[0] + deltaX > 100) {
          deltaX = 100 - point[0];
        }

        if (point[0] + deltaX < 0) {
          deltaX = -point[0];
        }

        if (point[1] + deltaY > 100) {
          deltaY = 100 - point[1];
        }

        if (point[1] + deltaY < 0) {
          deltaY = -point[1];
        }
      });

      return {
        ...state,
        points: state.points.map(point =>
          [
            point[0] + deltaX,
            point[1] + deltaY]
        ),
        indicatorPosition: [
          state.indicatorPosition[0] + deltaX,
          state.indicatorPosition[1] + deltaY
        ]
      };
    case DRAG_HANDLE:
      if (state.mode === 'polygon') {
        state = {
          ...state,
          points: [
            ...state.points.slice(0, action.index),
            action.cursor,
            ...state.points.slice(action.index + 1)
          ]
        };
      }
      else {
        const startPoints =
          state.startPoints ||
          (action.index % 2 === 0 ?
           [state.points[(action.index / 2 + 2) % 4]] :
           [state.points[((action.index + 3) / 2) % 4],
            state.points[((action.index + 5) / 2) % 4]]);

        state = {
          ...state,
          startPoints,
          previousPolygonPoints: null,
          points: getBoundingBox([
            action.cursor,
            ...startPoints
          ])
        };
      }

      return {
        ...state,
        indicatorPosition: ensureInPolygon(state.points, state.indicatorPosition)
      };

    case DRAG_HANDLE_STOP:
      return {
        ...state,
        startPoints: null
      };
    case DOUBLE_CLICK_HANDLE:
      if (state.mode !== 'polygon' || state.points.length <= 3) {
        return state;
      }

      const points = [
        ...state.points.slice(0, action.index),
        ...state.points.slice(action.index + 1)
      ];

      return {
        ...state,
        points,
        potentialPoint: null,
        indicatorPosition: ensureInPolygon(points, state.indicatorPosition)
      };
    case MOUSE_MOVE:
      if (state.mode !== 'polygon' || state.draggingPotentialPoint) {
        return state;
      }

      const [index, potentialPoint] = closestPointOnPolygon(state.points, action.cursor);

      return {
        ...state,
        potentialPointInsertIndex: index,
        potentialPoint
      };
    case DRAG_POTENTIAL_POINT:
      return {
        ...state,
        draggingPotentialPoint: true,
        potentialPoint: action.cursor
      };
    case DRAG_POTENTIAL_POINT_STOP:
      return {
        ...state,
        points: withPotentialPoint(state),
        draggingPotentialPoint: false,
        potentialPoint: null
      };
    case DRAG_INDICATOR:
      return {
        ...state,
        indicatorPosition: ensureInPolygon(state.points, action.cursor)
      }
    default:
      throw new Error(`Unknown action ${action.type}.`);
  }
}

export function drawnOutlinePoints(state) {
  if (state.draggingPotentialPoint) {
    return withPotentialPoint(state);
  }
  else {
    return state.points;}
}

const rectCursors = [
  'nwse-resize',
  'ns-resize',
  'nesw-resize',
  'ew-resize'
];

export function handles(state) {
  if (state.mode === 'rect') {
    return state.points.flatMap((point, index) => (
      [point, midpoint(point, state.points[(index + 1) % state.points.length])]
    )).map((point, index) => ({
      point,
      axis: index % 4 === 1 ? 'y' : index % 4 === 3 ? 'x' : null,
      cursor: rectCursors[index % 4],
      deletable: false
    }));
  }
  else {
    return state.points.map(point => ({
      point,
      circle: true,
      cursor: 'move',
      deletable: state.points.length > 3
    }));
  }
}

function withPotentialPoint(state) {
  return [
    ...state.points.slice(0, state.potentialPointInsertIndex),
    state.potentialPoint,
    ...state.points.slice(state.potentialPointInsertIndex)
  ];
}

function midpoint(p1, p2) {
  return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}

function getBoundingBox(polygon) {
  if (polygon.length === 0) {
    return null;
  }

  let minX = polygon[0][0];
  let minY = polygon[0][1];
  let maxX = polygon[0][0];
  let maxY = polygon[0][1];

  for (let i = 1; i < polygon.length; i++) {
    let [x, y] = polygon[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY]
  ];
}

function ensureInPolygon(polygon, point) {
  return isPointInPolygon(polygon, point) ?
         point :
         closestPointOnPolygon(polygon, point)[1]
}

function isPointInPolygon(polygon, point) {
  let x = point[0], y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0], yi = polygon[i][1];
    let xj = polygon[j][0], yj = polygon[j][1];

    let intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function closestPointOnPolygon(polygon, c, maxDistance = 5) {
  function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  }

  function closestPoint(A, B, C) {
    const AB = [B[0] - A[0], B[1] - A[1]];
    const AC = [C[0] - A[0], C[1] - A[1]];
    const abLength = AB[0] * AB[0] + AB[1] * AB[1]; // Dot product of AB with itself

    if (abLength === 0) return A; // A and B are the same points

    const proj = (AC[0] * AB[0] + AC[1] * AB[1]) / abLength; // Projection ratio of AC on AB

    if (proj < 0) return A; // Closer to A
    else if (proj > 1) return B; // Closer to B
    else return [A[0] + proj * AB[0], A[1] + proj * AB[1]]; // Point on the segment
  }

  let closest = null;
  let minDistance = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const A = polygon[i];
    const B = polygon[(i + 1) % polygon.length];

    const point = closestPoint(A, B, c);
    const dist = distance(c, point);

    if (dist < minDistance) {
      minDistance = dist;
      closest = [i + 1, point];
    }
  }

  return closest;
}
