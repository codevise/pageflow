import React from 'react';
import {storiesOf} from '@storybook/react';

import {panZoomExamples} from 'pageflow-scrolled/spec/contentElements/hotspots/panZoomExamples';
import {getPanZoomStepTransform, getInitialTransform} from './panZoom';
import {toString as toTransformString} from './usePanZoomTransforms';
import {getBoundingRect} from './getBoundingRect';

import styles from './panZoom-stories.module.css';

storiesOf('Content Elements/hotspots', module)
  .add('panZoom', () => {
    return (
      <div className={styles.examples}>
        <p>
          First column: Image base size with image height matching containe height<br />
          Second column: Initial transform to ensure all areas are within viewport<br />
          Third column: Step transform to zoom to area<br />
          <br />
          Blue rect: Bounding box of all areas<br />
          Red rect: Bounding box of area outline
          Yellow dot: Indicator of area
        </p>
        {panZoomExamples.map(example => {
          const initial = getInitialTransform({
            containerWidth: example.container.width,
            containerHeight: example.container.height,
            imageFileWidth: example.imageFile.width,
            imageFileHeight: example.imageFile.height,
            areasBoundingRect: example.areasBoundingRect,
            indicatorPositions: [example.indicatorPosition]
          });

          const step = getPanZoomStepTransform({
            containerWidth: example.container.width,
            containerHeight: example.container.height,
            imageFileWidth: example.imageFile.width,
            imageFileHeight: example.imageFile.height,
            areaOutline: example.area.outline,
            areaZoom: example.area.zoom,
            initialScale: initial.wrapper.scale,
            indicatorPositions: [example.indicatorPosition]
          });

          const areaBoundingRect = getBoundingRect(example.area.outline);

          return (
            <div className={styles.example} key={example.name}>
              <h3>{example.name}</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Area Zoom</th>
                    <td>{example.area.zoom}%</td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.columns}>
                {[null, initial, step].map((transform, index) =>
                  <div key={index}
                       className={styles.container}
                       style={{width: example.container.width,
                               height: example.container.height,
                               '--image-aspect-ratio': `${example.imageFile.width} / ${example.imageFile.height}`}}>
                    <div className={styles.wrapper}
                         style={{transform: toTransformString(transform?.wrapper)}}>
                      <div className={styles.image}>
                        <div className={styles.areasBoundingRect}
                             style={{top: `${example.areasBoundingRect.top}%`,
                                     left: `${example.areasBoundingRect.left}%`,
                                     width: `${example.areasBoundingRect.width}%`,
                                     height: `${example.areasBoundingRect.height}%`}} />

                        <div className={styles.area}
                             style={{top: `${areaBoundingRect.top}%`,
                                     left: `${areaBoundingRect.left}%`,
                                     width: `${areaBoundingRect.width}%`,
                                     height: `${areaBoundingRect.height}%`}} />

                      </div>
                    </div>
                    <div className={styles.wrapper}
                         style={{transform: toTransformString(transform?.indicators[0])}}>
                      <div className={styles.indicator}
                           style={{left: `${example.indicatorPosition[0]}%`,
                                   top: `${example.indicatorPosition[1]}%`}} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )
  })
