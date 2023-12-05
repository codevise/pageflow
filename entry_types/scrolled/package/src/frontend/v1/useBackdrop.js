import {useFileWithInlineRights} from '../../entryState';
import {usePortraitOrientation} from '../usePortraitOrientation';

export function useBackdrop(section) {
  const videoBackdrop = useFileBackdrop({
    section,
    collectionName: 'videoFiles',
    propertyName: 'video'
  });
  const imageBackdrop = useFileBackdrop({
    section,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });

  if (section.backdrop?.color ||
      (section.backdrop?.image && section.backdrop.image.toString().startsWith('#'))) {
    return {
      color: section.backdrop.color || section.backdrop.image
    }
  }
  else {
    return videoBackdrop || imageBackdrop || {};
  }
}

function useFileBackdrop({section, collectionName, propertyName}) {
  const file = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName,
    propertyName
  });
  const mobileFile = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName,
    propertyName: `${propertyName}Mobile`
  });

  const mobile = usePortraitOrientation({
    active: file && mobileFile
  });

  if (mobileFile && (mobile || !file)) {
    return {
      [propertyName]: mobileFile,
      motifArea: section.backdrop[`${propertyName}MobileMotifArea`],
      effects: section.backdropEffectsMobile
    }
  }
  else if (file) {
    return {
      [propertyName]: file,
      motifArea: section.backdrop[`${propertyName}MotifArea`],
      effects: section.backdropEffects
    }
  }
  else {
    return null;
  }
}
