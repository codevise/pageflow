import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import React, {useEffect, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {DraggableCore} from 'react-draggable';

import {utils, paletteColor} from 'pageflow-scrolled/frontend'
import {buttonStyles} from 'pageflow-scrolled/editor'

import {
  reducer,
  drawnOutlinePoints,
  handles,
  SET_MODE,
  DRAG,
  DRAG_HANDLE,
  DRAG_HANDLE_STOP,
  DOUBLE_CLICK_HANDLE,
  MOUSE_MOVE,
  DRAG_POTENTIAL_POINT,
  DRAG_POTENTIAL_POINT_STOP,
  DRAG_INDICATOR
} from './reducer';

import styles from './DraggableEditorView.module.css';

import squareIcon from './images/square.svg';
import polygonIcon from './images/polygon.svg';

const i18nPrefix = 'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog';

export const DraggableEditorView = Marionette.View.extend({
  render() {
    ReactDOM.render(
      <DraggableEditor
        imageSrc={this.options.file.getBackgroundPositioningImageUrl()}
        portrait={this.options.file.get('width') < this.options.file.get('height')}
        indicatorColor={paletteColor(this.model.get(this.getPropertyName('color')) || this.model.get('color'))}
        initialMode={this.model.get(this.getPropertyName('mode'))}
        initialPoints={this.model.get(this.getPropertyName('outline'))}
        initialIndicatorPosition={this.model.get(this.getPropertyName('indicatorPosition'))}
        onModeChange={mode => this.mode = mode}
        onPointsChange={points => this.points = points}
        onIndicatorPositionChange={indicatorPosition => this.indicatorPosition = indicatorPosition} />,
      this.el
    );

    return this;
  },

  save() {
    if (this.mode) {
      this.model.set(this.getPropertyName('mode'), this.mode);
    }

    if (this.points) {
      this.model.set(this.getPropertyName('outline'), this.points);
    }

    if (this.indicatorPosition) {
      this.model.set(this.getPropertyName('indicatorPosition'), this.indicatorPosition);
    }
  },

  getPropertyName(suffix) {
    return this.options.portrait ?
           `portrait${utils.capitalize(suffix)}` :
           suffix;
  }
});

function DraggableEditor({
  imageSrc, portrait, indicatorColor,
  initialMode, initialPoints, initialIndicatorPosition,
  onModeChange, onPointsChange, onIndicatorPositionChange
}) {
  const [state, dispatch] = useReducer(reducer, {
    mode: initialMode || 'rect',
    points: initialPoints || [[40, 40], [60, 40], [60, 60], [40, 60]],
    indicatorPosition: initialIndicatorPosition || [50, 50]
  });

  const {
    mode, points, potentialPoint, indicatorPosition
  } = state;

  useEffect(
    () => { onModeChange(mode); },
    [onModeChange, mode]
  );

  useEffect(
    () => { onPointsChange(points); },
    [onPointsChange, points]
  );

  useEffect(
    () => { onIndicatorPositionChange(indicatorPosition); },
    [onIndicatorPositionChange, indicatorPosition]
  );

  const ref = useRef();

  function clientToPercent(event) {
    const rect = ref.current.getBoundingClientRect();

    return [
      Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)),
      Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100))
    ];
  }

  return (
    <div>
      <ModeButtons mode={mode} dispatch={dispatch} />

      <div className={styles.wrapper}>
        <img className={classNames(styles.image, {[styles.portraitImage]: portrait})}
             src={imageSrc}
             alt={I18n.t(`${i18nPrefix}.hotspots_image`)} />
        <div ref={ref}
             className={styles.overlay}
             onMouseMove={event => dispatch({type: MOUSE_MOVE, cursor: clientToPercent(event)})}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <DraggableCore onDrag={(event, dragEvent) => {
              const rect = ref.current.getBoundingClientRect();

              dispatch({
                type: DRAG,
                delta: [
                  dragEvent.deltaX / rect.width * 100,
                  dragEvent.deltaY / rect.height * 100
                ]
              })
            }}>
              <polygon points={drawnOutlinePoints(state).map(coords =>
                coords.map(coord => coord).join(',')
              ).join(' ')} />
            </DraggableCore>
          </svg>

          {handles(state).map((handle, index) =>
            <Handle key={index}
                    point={handle.point}
                    axis={handle.axis}
                    cursor={handle.cursor}
                    circle={handle.circle}
                    title={handle.deletable ?
                           I18n.t(`${i18nPrefix}.double_click_to_delete`) : null}
                    onDoubleClick={event => dispatch({
                      type: DOUBLE_CLICK_HANDLE,
                      index
                    })}
                    onDrag={event => dispatch({
                      type: DRAG_HANDLE,
                      index,
                      cursor: clientToPercent(event)
                    })}
                    onDragStop={event => dispatch({
                      type: DRAG_HANDLE_STOP
                    })} />
          )}

          {potentialPoint && <Handle point={potentialPoint}
                                     circle={true}
                                     potential={true}
                                     onDrag={event => dispatch({
                                       type: DRAG_POTENTIAL_POINT,
                                       cursor: clientToPercent(event)
                                     })}
                                     onDragStop={event => dispatch({
                                       type: DRAG_POTENTIAL_POINT_STOP
                                     })} />}

          <Indicator position={indicatorPosition}
                     color={indicatorColor}
                     onDrag={event => dispatch({
                       type: DRAG_INDICATOR,
                       cursor: clientToPercent(event)
                     })} />
        </div>
      </div>
    </div>
  );
}

const modeIcons = {
  rect: squareIcon,
  polygon: polygonIcon
};

function ModeButtons({mode, dispatch}) {
  return (
    <div className={styles.buttons}>
      {['rect', 'polygon'].map(availableMode =>
        <button key={availableMode}
                type="button"
                className={buttonStyles.secondaryIconButton}
                aria-pressed={mode === availableMode}
                onClick={() => dispatch({type: SET_MODE, value: availableMode})}>
          <img src={modeIcons[availableMode]} alt="" width="20" height="20" />
          {I18n.t(availableMode, {scope: `${i18nPrefix}.modes`})}
        </button>
      )}
    </div>
  );
}

function Handle({point, circle, potential, title, cursor, onDrag, onDragStop, onDoubleClick}) {
  return (
    <DraggableCore onDrag={onDrag}
                   onStop={onDragStop}>
      <div className={classNames(styles.handle,
                                 {[styles.circle]: circle,
                                  [styles.potential]: potential})}
           tabIndex="0"
           onDoubleClick={onDoubleClick}
           title={title}
           style={{left: `${point[0]}%`, top: `${point[1]}%`, cursor}} />
    </DraggableCore>
  );
}

function Indicator({position, color, onDrag}) {
  return (
    <DraggableCore onDrag={onDrag}>
      <div className={styles.indicator}
           style={{
             left: `${position[0]}%`,
             top: `${position[1]}%`,
             '--color': color
           }}
           title={I18n.t(`${i18nPrefix}.indicator_title`)} />
    </DraggableCore>
  );
}
