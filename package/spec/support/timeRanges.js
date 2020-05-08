export function createTimeRanges(start, end){
  if (Array.isArray(start)) {
    return createTimeRangesObj(start);
  } else if (start === undefined || end === undefined) {
    return createTimeRangesObj();
  }
  return createTimeRangesObj([[start, end]]);
}

export { createTimeRanges as createTimeRange };

function createTimeRangesObj(ranges){
  if (ranges === undefined || ranges.length === 0) {
    return {
      length: 0,
      start: function() {
        throw new Error('This TimeRanges object is empty');
      },
      end: function() {
        throw new Error('This TimeRanges object is empty');
      }
    };
  }
  return {
    length: ranges.length,
    start: function(i) { return ranges[i][0]; },
    end: function(i) { return ranges[i][1]; }
  };
}