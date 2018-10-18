import {registry as pageTypeRegistry} from 'registerPageType';
import {registry as widgetTypeRegistry} from 'registerWidgetType';

import createStore from 'createStore';

import backgroundMedia from 'backgroundMedia';
import cookieNotice from 'cookieNotice';
import themingModule from 'theming';
import storylinesModule from 'storylines';
import chaptersModule from 'chapters';
import pagesModule, {createPageType} from 'pages';
import pageTypesModule from 'pageTypes';
import currentModule from 'current';
import filesModule from 'files';
import settingsModule from 'settings';
import i18nModule from 'i18n';
import entryModule from 'entry';
import hotkeysModule from 'hotkeys';
import hideTextModule from 'hideText';
import widgetsModule, {createWidgetType} from 'widgets';
import widgetPresenceModule from 'widgetPresence';

export default function(pageflow) {
  const isEditor = !!pageflow.storylines;
  const isServerSide = !pageflow.settings;

  const seed = pageflow.seed;
  const collections = isEditor ? pageflow : seed;

  const options = {
    isServerSide,

    locale: seed.locale,
    slug: seed.slug,

    fileUrlTemplates: seed['file_url_templates'],
    modelTypes: seed['file_model_types'],
    pageTypesSeed: seed['page_types'],

    pageTypes: pageTypeRegistry,

    theming: seed.theming,
    files: collections.files || {},
    storylines: collections.storylines,
    chapters: collections.chapters,
    pages: collections.pages,
    widgets: isEditor ? pageflow.entry.widgets : seed.widgets,

    cookies: pageflow.cookies,
    hideText: pageflow.hideText,
    events: pageflow.events,
    settings: pageflow.settings,
    widgetsApi: pageflow.widgets,

    window: isServerSide ? null : window
  };

  const store = createStore([
    backgroundMedia,
    cookieNotice,
    i18nModule,
    themingModule,
    entryModule,
    currentModule,
    storylinesModule,
    chaptersModule,
    pagesModule,
    filesModule,
    settingsModule,
    hideTextModule,
    widgetsModule,
    widgetPresenceModule,
    pageTypesModule,
    hotkeysModule
  ], options);


  if (!isServerSide) {
    pageTypeRegistry.forEach(options =>
      pageflow.pageType.register(options.name, createPageType({
        ...options,
        Component: options.component,
        store
      }))
    );

    widgetTypeRegistry.forEach(({name, component}) =>
      pageflow.widgetTypes.register(name, createWidgetType(component, store))
    );
  }

  return store;
}
