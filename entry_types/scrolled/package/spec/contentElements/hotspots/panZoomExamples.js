const imageFile = {
  width: 30,
  height: 20
};

const containers = [
  {name: 'Spanned container', props: {width: 300, height: 200}},
  {name: 'Wide container', props: {width: 400, height: 200}},
  {name: 'Narrow container', props: {width: 250, height: 200}},
];

const cases = [
  {
    name: 'Fits area vertically',
    area: {
      outline: [[50, 50], [60, 70]],
      zoom: 90
    },
    areasBoundingRect: {
      top: 10,
      left: 10,
      width: 60,
      height: 70
    }
  },
  {
    name: 'Fits area horizontally',
    area: {
      outline: [[50, 50], [70, 60]],
      zoom: 90
    },
    areasBoundingRect: {
      top: 10,
      left: 10,
      width: 65,
      height: 60
    }
  },
  {
    name: 'Prevents moving beyond top left bounds',
    area: {
      outline: [[5, 5], [35, 10]],
      zoom: 50
    },
    areasBoundingRect: {
      top: 5,
      left: 5,
      width: 40,
      height: 50
    }
  },
  {
    name: 'Prevents moving beyond bottom right bounds',
    area: {
      outline: [[70, 90], [95, 95]],
      zoom: 50
    },
    areasBoundingRect: {
      top: 35,
      left: 55,
      width: 40,
      height: 60
    }
  },
  {
    name: 'Full width motif',
    area: {
      outline: [[50, 50], [60, 70]],
      zoom: 90
    },
    areasBoundingRect: {
      top: 10,
      left: 0,
      width: 100,
      height: 70
    }
  },
  {
    name: 'Full height motif',
    area: {
      outline: [[50, 50], [60, 70]],
      zoom: 90
    },
    areasBoundingRect: {
      top: 0,
      left: 45,
      width: 20,
      height: 100
    }
  },
]

export const panZoomExamples =
  containers.flatMap(container =>
    cases.map(c => ({
      name: [container.name, c.name].join(', '),
      container: container.props,
      imageFile,
      area: c.area,
      indicatorPosition: centerOf(c.area.outline),
      areasBoundingRect: c.areasBoundingRect
    }))
  );

function centerOf(outline) {
  return [
    (outline[0][0] + outline[1][0]) / 2,
    (outline[0][1] + outline[1][1]) / 2,
  ]
}
