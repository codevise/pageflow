import Marionette from 'backbone.marionette';
import {inputView} from 'pageflow/ui';
import I18n from 'i18n-js';

import styles from './SectionPaddingVisualizationView.module.css';

const prefix = 'pageflow_scrolled.editor.section_padding_visualization';

export const SectionPaddingVisualizationView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: (data) => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    ${data.infoText ? `<div class="${styles.infoText}">${data.infoText}</div>` : ''}
    <div class="${styles.preview}"></div>
  `,

  serializeData() {
    return {
      infoText: this.options.infoText
    };
  },

  ui: {
    preview: `.${styles.preview}`
  },

  onRender() {
    this.listenTo(this.model, 'change:layout', this.update);
    this.update();
  },

  update() {
    const svg = this.getSvg();
    this.ui.preview.html(svg);
  },

  getSvg() {
    const portrait = this.options.portrait;
    const layout = this.model.get('layout') || 'left';

    switch (this.options.variant) {
      case 'intersectingAuto': return intersectingAutoSvg(portrait, layout);
      case 'intersectingManual': return intersectingManualSvg(portrait, layout);
      case 'sideBySide': return sideBySideSvg(portrait, layout);
      case 'topPadding': return topPaddingSvg(portrait, layout);
      case 'bottomPadding': return bottomPaddingSvg(portrait, layout);
      default: return '';
    }
  }
});

function intersectingAutoSvg(portrait, layout) {
  if (portrait) {
    return intersectingAutoSvgPortrait(layout);
  }

  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '150;125;125;150' : '30;55;55;30';
  const textXY = right
    ? '100 62;63 41;63 41;100 62'
    : center
      ? '55 62;55 41;55 41;55 62'
      : '10 62;47 41;47 41;10 62';

  return `
    <svg viewBox="0 0 180 80" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_auto`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (full width to 4:3) -->
        <clipPath id="intersectingAutoViewport">
          <rect y="0" height="80">
            <animate attributeName="x" values="0;37;37;0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="180;106;106;180" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('autoDiagonalStripes')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingAutoViewport)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

        <!-- Auto padding zone (striped, height animates with arrow + 3px bottom gap) -->
        <rect x="0" y="0" width="180" fill="url(#autoDiagonalStripes)">
          <animate attributeName="height" values="58;37;37;58" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
        </rect>

        <!-- Scaled silhouette (simulates cover behavior) -->
        <g style="transform-origin: 90px 3px">
          <animateTransform attributeName="transform" type="scale"
            values="1 1;0.589 0.589;0.589 0.589;1 1" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <g transform="translate(60, 3)">
            <!-- Head (ellipse) -->
            <ellipse class="${styles.silhouette}" cx="30" cy="18" rx="13" ry="14" />
            <!-- Shoulders (curved path) -->
            <path class="${styles.silhouette}" d="M8 52 Q8 34 30 34 Q52 34 52 52" />
          </g>
        </g>

        <!-- Corner markers (position-only animation, fixed size) -->
        <g class="${styles.cornerMarker}">
          <!-- Top-left -->
          <path d="M0 0 h5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="60 3;72 3;72 3;60 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Top-right -->
          <path d="M0 0 h-5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="120 3;108 3;108 3;120 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-left -->
          <path d="M0 0 h5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="60 55;72 34;72 34;60 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-right -->
          <path d="M0 0 h-5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="120 55;108 34;108 34;120 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
        </g>

        <!-- Arrow (centered between viewport edge and motif) -->
        <g class="${styles.arrow}">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="52">
            <animate attributeName="y2" values="52;31;31;52" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </line>
          <polyline points="-4,4 0,0 4,4" />
          <polyline points="-4,48 0,52 4,48">
            <animateTransform attributeName="transform" type="translate"
              values="0 0;0 -21;0 -21;0 0" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </polyline>
        </g>

        <!-- Text lines (inside viewport, animated to follow motif and viewport edge) -->
        <g class="${styles.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textXY}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <rect x="${centerRagged ? 0 : 0}" y="0" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="6" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="12" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 15 : 0}" y="18" width="40" height="1.4" rx="0.7" />
          <!-- Second paragraph (visible when text moves up) -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="65" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="36" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 17.5 : 0}" y="48" width="35" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}

function intersectingAutoSvgPortrait(layout) {
  // Canvas: 142x142, animates viewport width from 80 (9:16) to 142 (square)
  // Height stays fixed at 142. Only x and width animate.
  // 9:16: x=31, width=80 | Square: x=0, width=142
  // Scale factor: 80/142 ≈ 0.563 (motif scales with viewport width)
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '104;129;129;104' : '38;13;13;38';
  const textX = right
    ? '48 62;79 108;79 108;48 62'
    : center
      ? '44 62;44 108;44 108;44 62'
      : '39 62;8 108;8 108;39 62';

  return `
    <svg viewBox="0 0 142 142" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_auto`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (9:16 to square, width only) -->
        <clipPath id="intersectingAutoViewportPortrait">
          <rect y="0" height="142">
            <animate attributeName="x" values="31;0;0;31" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="80;142;142;80" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('autoDiagonalStripesPortrait')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingAutoViewportPortrait)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="142" height="142" />

        <!-- Auto padding zone (striped, height animates with arrow) -->
        <rect x="0" y="0" width="142" fill="url(#autoDiagonalStripesPortrait)">
          <animate attributeName="height" values="58;103;103;58" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
        </rect>

        <!-- Scaled silhouette (simulates cover behavior) -->
        <g style="transform-origin: 71px 3px">
          <animateTransform attributeName="transform" type="scale"
            values="0.563 0.563;1 1;1 1;0.563 0.563" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <g transform="translate(26, 3)">
            <!-- Head (ellipse) -->
            <ellipse class="${styles.silhouette}" cx="45" cy="32" rx="26" ry="28" />
            <!-- Shoulders (curved path) -->
            <path class="${styles.silhouette}" d="M8 100 Q8 64 45 64 Q82 64 82 100" />
          </g>
        </g>

        <!-- Corner markers (position-only animation, fixed size) -->
        <g class="${styles.cornerMarker}">
          <!-- Top-left -->
          <path d="M0 0 h5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="45 3;26 3;26 3;45 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Top-right -->
          <path d="M0 0 h-5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="97 3;116 3;116 3;97 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-left -->
          <path d="M0 0 h5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="45 55;26 100;26 100;45 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-right -->
          <path d="M0 0 h-5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="97 55;116 100;116 100;97 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
        </g>

        <!-- Arrow (centered between viewport edge and motif) -->
        <g class="${styles.arrow}" style="stroke-width: 2">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="52">
            <animate attributeName="y2" values="52;97;97;52" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </line>
          <polyline points="-5,5 0,0 5,5" />
          <polyline points="-5,47 0,52 5,47">
            <animateTransform attributeName="transform" type="translate"
              values="0 0;0 45;0 45;0 0" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </polyline>
        </g>

        <!-- Text lines (inside viewport, animated to follow motif) -->
        <g class="${styles.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <rect x="${centerRagged ? 0 : 0}" y="0" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="6" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="12" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 12.5 : 0}" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="48" width="35" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}

function intersectingManualSvg(portrait, layout) {
  if (portrait) {
    return intersectingManualSvgPortrait(layout);
  }

  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '125;150;150;125' : '55;30;30;55';
  const textX = right
    ? '63;100;100;63'
    : center
      ? '55;55;55;55'
      : '47;10;10;47';

  return `
    <svg viewBox="0 0 180 80" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_manual`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (4:3 to full width) -->
        <clipPath id="intersectingManualViewport">
          <rect y="0" height="80">
            <animate attributeName="x" values="37;0;0;37" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="106;180;180;106" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('manualDiagonalStripes')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingManualViewport)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

        <!-- Manual padding zone (striped, 3px gap below arrow) -->
        <rect x="0" y="0" width="180" height="26" fill="url(#manualDiagonalStripes)" />

        <!-- Dimmed motif and corners in manual mode -->
        <g style="opacity: 0.5">
          <!-- Scaled silhouette (simulates cover behavior, extends behind text) -->
          <g style="transform-origin: 90px 3px">
            <animateTransform attributeName="transform" type="scale"
              values="0.589 0.589;1 1;1 1;0.589 0.589" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
            <g transform="translate(60, 3)">
              <!-- Head (ellipse) -->
              <ellipse class="${styles.silhouette}" cx="30" cy="18" rx="13" ry="14" />
              <!-- Shoulders (curved path) -->
              <path class="${styles.silhouette}" d="M8 52 Q8 34 30 34 Q52 34 52 52" />
            </g>
          </g>

          <!-- Corner markers (position-only animation, fixed size) -->
          <g class="${styles.cornerMarker}">
            <!-- Top-left -->
            <path d="M0 0 h5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="72 3;60 3;60 3;72 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Top-right -->
            <path d="M0 0 h-5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="108 3;120 3;120 3;108 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-left -->
            <path d="M0 0 h5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="72 34;60 55;60 55;72 34" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-right -->
            <path d="M0 0 h-5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="108 34;120 55;120 55;108 34" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
          </g>
        </g>

        <!-- Arrow (horizontal animation only, fixed height, 7px gap to text) -->
        <g class="${styles.arrow}">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="20" />
          <polyline points="-4,4 0,0 4,4" />
          <polyline points="-4,16 0,20 4,16" />
        </g>

        <!-- Text lines (horizontal animation, fixed y, intersects motif) -->
        <g class="${styles.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX.split(';').map(x => `${x} 30`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="0" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="6" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="12" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 15 : 0}" y="18" width="40" height="1.4" rx="0.7" />
          <!-- Clipped paragraph below -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="65" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="36" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="70" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}

function intersectingManualSvgPortrait(layout) {
  // Canvas: 142x142, animates viewport width from 142 (square) to 80 (9:16)
  // Height stays fixed at 142. Only x and width animate.
  // Square: x=0, width=142 | 9:16: x=31, width=80
  // Scale factor: 142/80 ≈ 1.775 → 0.563 (motif scales with viewport width)
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '129;104;104;129' : '13;38;38;13';
  const textX = right
    ? '79 50;48 50;48 50;79 50'
    : center
      ? '44 50;44 50;44 50;44 50'
      : '8 50;39 50;39 50;8 50';

  return `
    <svg viewBox="0 0 142 142" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_manual`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (square to 9:16, width only) -->
        <clipPath id="intersectingManualViewportPortrait">
          <rect y="0" height="142">
            <animate attributeName="x" values="0;31;31;0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="142;80;80;142" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('manualDiagonalStripesPortrait')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingManualViewportPortrait)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="142" height="142" />

        <!-- Manual padding zone (striped, fixed height) -->
        <rect x="0" y="0" width="142" height="46" fill="url(#manualDiagonalStripesPortrait)" />

        <!-- Dimmed motif and corners in manual mode -->
        <g style="opacity: 0.5">
          <!-- Scaled silhouette (simulates cover behavior) -->
          <g style="transform-origin: 71px 3px">
            <animateTransform attributeName="transform" type="scale"
              values="1 1;0.563 0.563;0.563 0.563;1 1" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
            <g transform="translate(26, 3)">
              <!-- Head (ellipse) -->
              <ellipse class="${styles.silhouette}" cx="45" cy="32" rx="26" ry="28" />
              <!-- Shoulders (curved path) -->
              <path class="${styles.silhouette}" d="M8 100 Q8 64 45 64 Q82 64 82 100" />
            </g>
          </g>

          <!-- Corner markers (position-only animation, fixed size) -->
          <g class="${styles.cornerMarker}">
            <!-- Top-left -->
            <path d="M0 0 h5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="26 3;45 3;45 3;26 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Top-right -->
            <path d="M0 0 h-5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="116 3;97 3;97 3;116 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-left -->
            <path d="M0 0 h5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="26 100;45 55;45 55;26 100" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-right -->
            <path d="M0 0 h-5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="116 100;97 55;97 55;116 100" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
          </g>
        </g>

        <!-- Arrow (horizontal animation only, fixed height) -->
        <g class="${styles.arrow}" style="stroke-width: 2">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="40" />
          <polyline points="-5,5 0,0 5,5" />
          <polyline points="-5,35 0,40 5,35" />
        </g>

        <!-- Text lines (horizontal animation, fixed y, intersects motif) -->
        <g class="${styles.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="0" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="6" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="12" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 12.5 : 0}" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="48" width="35" height="1.4" rx="0.7" />
          <!-- Third paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="60" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="66" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="72" width="50" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}

function sideBySideSvg(portrait, layout) {
  // Center layout not supported for side-by-side, fall back to left
  const right = layout === 'right';

  if (portrait) {
    const motifX = right ? 4 : 58;
    const textX = right ? 47 : 8;
    const arrowX = right ? 75 : 25;

    return `
      <svg viewBox="0 0 100 110" class="${styles.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.side_by_side`)}</title>
        <defs>
          ${diagonalStripesPattern('diagonalStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Manual padding zone (striped, extends to top corners) -->
        <rect fill="url(#diagonalStripesPortrait)" x="0" y="0" width="100" height="30" />

        ${staticArrow(arrowX, 5)}

        <!-- Motif area with corner markers and silhouette -->
        <g transform="translate(${motifX}, 35)">
          <!-- Corner markers (L-brackets, thinner style) -->
          <path class="${styles.cornerMarker}" d="M0 0 h5 M0 0 v5" />
          <path class="${styles.cornerMarker}" d="M38 0 h-5 M38 0 v5" />
          <path class="${styles.cornerMarker}" d="M0 38 h5 M0 38 v-5" />
          <path class="${styles.cornerMarker}" d="M38 38 h-5 M38 38 v-5" />

          <!-- Head (ellipse) -->
          <ellipse class="${styles.silhouette}" cx="19" cy="12" rx="10" ry="11" />

          <!-- Shoulders (curved path) -->
          <path class="${styles.silhouette}" d="M5 38 Q5 24 19 24 Q33 24 33 38" />
        </g>

        <!-- Text lines (side by side with motif) -->
        <g class="${styles.textBlock}" transform="translate(${textX}, 38)">
          <!-- Main paragraph -->
          <rect x="0" y="0" width="45" height="1.4" rx="0.7" />
          <rect x="0" y="6" width="35" height="1.4" rx="0.7" />
          <rect x="0" y="12" width="42" height="1.4" rx="0.7" />
          <rect x="0" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="0" y="30" width="40" height="1.4" rx="0.7" />
          <rect x="0" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="0" y="42" width="35" height="1.4" rx="0.7" />
          <rect x="0" y="48" width="42" height="1.4" rx="0.7" />
        </g>
      </svg>
    `;
  }

  const motifX = right ? 10 : 115;
  const textX = right ? 90 : 10;
  const arrowX = right ? 135 : 45;

  return `
    <svg viewBox="0 0 180 80" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.side_by_side`)}</title>
      <defs>
        ${diagonalStripesPattern('diagonalStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Manual padding zone (striped, extends to top corners) -->
      <rect class="${styles.spacingZone}" x="0" y="0" width="180" height="30" />

      ${staticArrow(arrowX, 5)}

      <!-- Motif area with corner markers and silhouette (centered vertically) -->
      <g class="${styles.motifArea}" transform="translate(${motifX}, 20)">
        <!-- Corner markers (L-brackets) -->
        <path class="${styles.cornerMarker}" d="M0 0 h5 M0 0 v5" />
        <path class="${styles.cornerMarker}" d="M55 0 h-5 M55 0 v5" />
        <path class="${styles.cornerMarker}" d="M0 40 h5 M0 40 v-5" />
        <path class="${styles.cornerMarker}" d="M55 40 h-5 M55 40 v-5" />

        <!-- Head (ellipse) -->
        <ellipse class="${styles.silhouette}" cx="27" cy="13" rx="9" ry="10" />

        <!-- Shoulders (curved path) -->
        <path class="${styles.silhouette}" d="M14 40 Q14 25 27 25 Q40 25 40 40" />
      </g>

      <!-- Text lines -->
      <g class="${styles.textBlock}" transform="translate(${textX}, 35)">
        <!-- Main paragraph -->
        <rect x="0" y="0" width="80" height="1.4" rx="0.7" />
        <rect x="0" y="6" width="55" height="1.4" rx="0.7" />
        <rect x="0" y="12" width="70" height="1.4" rx="0.7" />
        <rect x="0" y="18" width="45" height="1.4" rx="0.7" />
        <!-- Clipped paragraph below -->
        <rect x="0" y="30" width="65" height="1.4" rx="0.7" />
        <rect x="0" y="36" width="50" height="1.4" rx="0.7" />
        <rect x="0" y="42" width="70" height="1.4" rx="0.7" />
      </g>
    </svg>
  `;
}

function topPaddingSvg(portrait, layout) {
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';

  if (portrait) {
    const textX = center ? 10 : right ? 10 : 10;
    const arrowX = center ? 50 : 50;

    return `
      <svg viewBox="0 0 100 110" class="${styles.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.top_padding`)}</title>
        <defs>
          ${diagonalStripesPattern('topPaddingStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Top padding zone (striped) -->
        <rect fill="url(#topPaddingStripesPortrait)" x="0" y="0" width="100" height="30" />

        ${staticArrow(arrowX, 5)}

        <!-- Text lines -->
        <g class="${styles.textBlock}">
          <!-- Main paragraph -->
          <rect x="${centerRagged ? textX : textX}" y="35" width="80" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 12.5 : textX}" y="41" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 5 : textX}" y="47" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 17.5 : textX}" y="53" width="45" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? textX + 2.5 : textX}" y="65" width="75" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 10 : textX}" y="71" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX : textX}" y="77" width="80" height="1.4" rx="0.7" />
          <!-- Clipped paragraph below -->
          <rect x="${centerRagged ? textX + 5 : textX}" y="89" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 15 : textX}" y="95" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 7.5 : textX}" y="101" width="65" height="1.4" rx="0.7" />
        </g>
      </svg>
    `;
  }

  const textX = right ? 90 : center ? 50 : 10;
  const arrowX = right ? 135 : center ? 90 : 45;

  return `
    <svg viewBox="0 0 180 80" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.top_padding`)}</title>
      <defs>
        ${diagonalStripesPattern('topPaddingStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Top padding zone (striped) -->
      <rect fill="url(#topPaddingStripes)" x="0" y="0" width="180" height="30" />

      ${staticArrow(arrowX, 5)}

      <!-- Text lines -->
      <g class="${styles.textBlock}">
        <!-- Main paragraph -->
        <rect x="${centerRagged ? textX : textX}" y="35" width="80" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 12.5 : textX}" y="41" width="55" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 5 : textX}" y="47" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 17.5 : textX}" y="53" width="45" height="1.4" rx="0.7" />
        <!-- Clipped paragraph below -->
        <rect x="${centerRagged ? textX + 5 : textX}" y="65" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 15 : textX}" y="71" width="50" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 7.5 : textX}" y="77" width="65" height="1.4" rx="0.7" />
      </g>
    </svg>
  `;
}

function bottomPaddingSvg(portrait, layout) {
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';

  if (portrait) {
    const textX = center ? 10 : right ? 10 : 10;
    const arrowX = center ? 50 : 50;

    return `
      <svg viewBox="0 0 100 110" class="${styles.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.bottom_padding`)}</title>
        <defs>
          ${diagonalStripesPattern('bottomPaddingStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Text lines (with clipped paragraph above to show continuation) -->
        <g class="${styles.textBlock}">
          <!-- Clipped paragraph above -->
          <rect x="${centerRagged ? textX + 5 : textX}" y="1" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 15 : textX}" y="7" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 7.5 : textX}" y="13" width="65" height="1.4" rx="0.7" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? textX : textX}" y="25" width="80" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 12.5 : textX}" y="31" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 5 : textX}" y="37" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 17.5 : textX}" y="43" width="45" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? textX + 2.5 : textX}" y="55" width="75" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 10 : textX}" y="61" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX : textX}" y="67" width="80" height="1.4" rx="0.7" />
        </g>

        <!-- Bottom padding zone (striped, extends to bottom corners) -->
        <rect fill="url(#bottomPaddingStripesPortrait)" x="0" y="80" width="100" height="30" />

        ${staticArrow(arrowX, 85)}
      </svg>
    `;
  }

  const textX = right ? 90 : center ? 50 : 10;
  const arrowX = right ? 135 : center ? 90 : 45;

  return `
    <svg viewBox="0 0 180 80" class="${styles.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.bottom_padding`)}</title>
      <defs>
        ${diagonalStripesPattern('bottomPaddingStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Text lines (with clipped paragraph above to show continuation) -->
      <g class="${styles.textBlock}">
        <!-- Clipped paragraph above -->
        <rect x="${centerRagged ? textX + 5 : textX}" y="1" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 15 : textX}" y="7" width="50" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 7.5 : textX}" y="13" width="65" height="1.4" rx="0.7" />
        <!-- Main paragraph -->
        <rect x="${centerRagged ? textX : textX}" y="25" width="80" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 12.5 : textX}" y="31" width="55" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 5 : textX}" y="37" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 17.5 : textX}" y="43" width="45" height="1.4" rx="0.7" />
      </g>

      <!-- Bottom padding zone (striped, extends to bottom corners) -->
      <rect fill="url(#bottomPaddingStripes)" x="0" y="50" width="180" height="30" />

      ${staticArrow(arrowX, 55)}
    </svg>
  `;
}

const easing = '0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1';

function diagonalStripesPattern(id) {
  return `
    <pattern id="${id}" patternUnits="userSpaceOnUse"
             width="6" height="6" patternTransform="rotate(45)">
      <rect x="0" y="0" width="3" height="6" fill="currentColor" opacity="0.1" />
    </pattern>
  `;
}

function staticArrow(x, y) {
  return `
    <g class="${styles.arrow}" transform="translate(${x}, ${y})">
      <line x1="0" y1="0" x2="0" y2="20" />
      <polyline points="-4,4 0,0 4,4" />
      <polyline points="-4,16 0,20 4,16" />
    </g>
  `;
}
