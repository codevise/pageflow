import {PageBackground, PageShadow} from 'components';
import PageBackgroundAsset from './PageBackgroundAsset';

export default function MediaPageBackground(props) {
  return (
    <PageBackground>
      <PageBackgroundAsset propertyNamePrefix={props.propertyNamePrefix} />
      <PageShadow page={props.page} />
    </PageBackground>
  );
}
