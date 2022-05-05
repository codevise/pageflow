import {useEffect, useState} from 'react';

export function RemotePeakData({audioFile, children}) {
  const peakDataUrl = audioFile?.urls.peakData;
  const [peakData, setPeakData] = useState('pending');

  useEffect(() => {
    if (peakDataUrl) {
      fetch(peakDataUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status} while loading peaks.`);
          }
          return response.json();
        })
        .then(peaks => {
          setPeakData(peaks.data);
        });
    }
    else {
      setPeakData(null);
    }
  }, [peakDataUrl]);

  if (peakData === 'pending') {
    return null;
  }
  else {
    return children(peakData);
  }
}
