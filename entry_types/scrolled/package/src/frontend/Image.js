import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

import {ImageStructuredData} from './ImageStructuredData';

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {Object} props.imageFile - Image file obtained via `useFile`.
 * @param {string|string[]} [props.variant] - Paperclip style to use. Defaults to
 *   large. Pass an array (e.g. `['large', 'ultra']`) to emit a `srcset` with
 *   width descriptors. The first entry is used as `src` fallback.
 * @param {string} [props.sizes] - Sizes attribute for srcset. Defaults to `"100vw"`.
 * @param {boolean} [props.load] - Whether to load the image. Can be used for lazy loading.
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 * @param {boolean} [props.preferSvg] - Use original if image is SVG.
 * @param {boolean} [props.fill=true] - Position absolute and fill parent.
 * @param {boolean} [props.fit=cover] - `"contain"` or `"cover"`.
 */
export function Image({imageFile, ...props}) {
  if (imageFile && imageFile.isReady && props.load) {
    return (
      <>
        {renderImageTag(props, imageFile)}
        {renderStructuredData(props, imageFile)}
      </>
    );
  }

  return null;
}

function renderImageTag(props, imageFile) {
  const cropPositionX = imageFile.cropPosition ? imageFile.cropPosition.x : 50;
  const cropPositionY = imageFile.cropPosition ? imageFile.cropPosition.y : 50;

  return (
    <img className={classNames({[styles.fill]: props.fill,
                                [styles.contain]: props.fit === 'contain'})}
         src={imageSrc(imageFile, props)}
         srcSet={imageSrcSet(imageFile, props)}
         sizes={imageSizes(imageFile, props)}
         alt={imageFile.configuration.alt ? imageFile.configuration.alt : ''}
         width={props.width}
         height={props.height}
         style={{
           objectPosition: `${cropPositionX}% ${cropPositionY}%`
         }} />
  );
}

function imageSrc(imageFile, props) {
  const {variant} = props;

  if (Array.isArray(variant)) {
    return imageUrl(imageFile, {...props, variant: variant[0]});
  }

  return imageUrl(imageFile, props);
}

function imageSrcSet(imageFile, {variant, preferSvg}) {
  if (!Array.isArray(variant)) return undefined;
  if (preferSvg && imageFile.extension?.toLowerCase() === 'svg') return undefined;
  if (!imageFile.variantWidths) return undefined;

  const entries = imageFile.variantWidths
    .filter(([, v]) => variant.includes(v) && imageFile.urls[v])
    .map(([w, v]) => `${imageFile.urls[v]} ${w}`);

  if (entries.length <= 1) return undefined;

  return entries.join(', ');
}

function imageSizes(imageFile, props) {
  if (imageSrcSet(imageFile, props)) {
    return props.sizes || '100vw';
  }

  return undefined;
}

function imageUrl(imageFile, {variant, preferSvg}) {
  if (variant === 'ultra' && !imageFile.urls.ultra) {
    variant = 'large';
  }

  if (preferSvg && imageFile.extension.toLowerCase() === 'svg') {
    return imageFile.urls.original;
  }
  else {
    return imageFile.urls[variant];
  }
}

function renderStructuredData(props, file) {
  if (props.structuredData && file) {
    return <ImageStructuredData file={file} />;
  }
}

Image.defaultProps = {
  load: true,
  variant: 'large',
  fill: true
};
