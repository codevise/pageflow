import {EntryDecorator} from './EntryDecorator';
import {ContentDecorator} from './ContentDecorator';
import {SectionDecorator} from './SectionDecorator';
import {ContentElementDecorator} from './ContentElementDecorator';
import {SelectableWidgetDecorator} from './SelectableWidgetDecorator';
import {WidgetDecorator} from './WidgetDecorator';
import {BackdropDecorator} from './BackdropDecorator';
import {BackgroundContentElementDecorator} from './BackgroundContentElementDecorator';
import {ForegroundDecorator} from './ForegroundDecorator';

import {LayoutWithPlaceholder} from './LayoutWithPlaceholder';
import {EditableText} from './EditableText';
import {EditableInlineText} from './EditableInlineText';
import {EditableTable} from './EditableTable';
import {EditableLink} from './EditableLink';
import {LinkTooltipProvider} from './LinkTooltip';
import {WidgetSelectionRect} from './WidgetSelectionRect';
import {ActionButton} from './ActionButton';
import {ActionButtons} from './ActionButtons';
import {PhonePlatformProvider} from './PhonePlatformProvider';
import {Placeholder} from './Placeholder';

export const extensions = {
  decorators: {
    Entry: EntryDecorator,
    Content: ContentDecorator,
    Section: SectionDecorator,
    ContentElement: ContentElementDecorator,
    SelectableWidget: SelectableWidgetDecorator,
    Widget: WidgetDecorator,
    Backdrop: BackdropDecorator,
    BackgroundContentElement: BackgroundContentElementDecorator,
    Foreground: ForegroundDecorator
  },
  alternatives: {
    LayoutWithPlaceholder,
    EditableText,
    EditableInlineText,
    EditableTable,
    EditableLink,
    LinkTooltipProvider,
    WidgetSelectionRect,
    ActionButton,
    ActionButtons,
    PhonePlatformProvider,
    Placeholder
  }
};
