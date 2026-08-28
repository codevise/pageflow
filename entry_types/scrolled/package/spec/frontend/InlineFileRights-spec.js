import React from 'react';

import {InlineFileRights} from 'frontend/InlineFileRights';
import {api} from 'frontend/api';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('InlineFileRights', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.inline_file_rights_labels.image': 'Image',
    'pageflow_scrolled.public.inline_file_rights_labels.poster': 'Poster',
    'pageflow_scrolled.public.inline_file_rights_labels.video': 'Video',
    'pageflow_scrolled.public.ai_indicators.ai_generated': 'AI generated',
    'pageflow_scrolled.public.ai_indicators.ai_modified': 'AI modified'
  });

  beforeEach(() => {
    api.widgetTypes.register('inlineFileRightsWrapper', {
      component: function ({children}) {
        return (
          <div>Rights: {children}</div>
        )
      }
    });

    api.widgetTypes.register('inlineFileRightsFlags', {
      component: function ({hasRights, hasAiIndicators, children}) {
        return (
          <div>
            {`${hasRights}|${hasAiIndicators}`}
            {children}
          </div>
        )
      }
    });
  });

  const seed = {
    widgets: [{role: 'inlineFileRights', typeName: 'inlineFileRightsWrapper'}]
  };

  it('renders inline file rights widget as wrapper', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {},
      inlineRights: true
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(container).toHaveTextContent('Rights: ');
  });

  it('passes props to widget', () => {
    api.widgetTypes.register('inlineFileRightsWithProps', {
      component: function ({
        children,
        context, playerControlsFadedOut, playerControlsStandAlone,
        configuration
      }) {
        return (
          <div>
            {context} {playerControlsFadedOut.toString()} {playerControlsStandAlone.toString()} {configuration.some}
          </div>
        )
      }
    });

    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {},
      inlineRights: true
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{file}]}
                        context="playerControls"
                        configuration={{some: 'customOption'}}
                        playerControlsFadedOut={false}
                        playerControlsStandAlone={true} />,
      {
        seed: {
          widgets: [{role: 'inlineFileRights', typeName: 'inlineFileRightsWithProps'}]
        }
      }
    );

    expect(container).toHaveTextContent('playerControls false true customOption');
  });

  it('renders items for rights', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {},
      inlineRights: true
    };

    const {queryByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(queryByRole('listitem')).toHaveTextContent('My stock images');
  });

  it('supports labels to distinguish multiple files', () => {
    const videoFile = {
      id: 10,
      rights: 'My stock video',
      configuration: {},
      inlineRights: true
    };
    const poster = {
      id: 10,
      rights: 'My stock image',
      configuration: {},
      inlineRights: true
    };

    const {queryAllByRole} = renderInEntry(
      <InlineFileRights items={[
        {label: 'video', file: videoFile},
        {label: 'poster', file: poster}
      ]} />,
      {seed}
    );

    expect(queryAllByRole('listitem').map(node => node.textContent)).toEqual([
      'Video: My stock video',
      'Poster: My stock image',
    ]);
  });

  it('skips files without inlineRights property', () => {
    const videoFile = {
      id: 10,
      rights: 'My stock video',
      configuration: {},
      inlineRights: true
    };
    const poster = {
      id: 10,
      rights: 'My stock image',
      configuration: {}
    };

    const {queryAllByRole} = renderInEntry(
      <InlineFileRights items={[
        {label: 'video', file: videoFile},
        {label: 'poster', file: poster}
      ]} />,
      {seed}
    );

    expect(queryAllByRole('listitem').map(node => node.textContent)).toEqual([
      'Video: My stock video'
    ]);
  });

  it('skips items without file', () => {
    const videoFile = {
      id: 10,
      rights: 'My stock video',
      configuration: {},
      inlineRights: true
    };

    const {queryAllByRole} = renderInEntry(
      <InlineFileRights items={[
        {label: 'video', file: videoFile},
        {label: 'poster', file: null}
      ]} />,
      {seed}
    );

    expect(queryAllByRole('listitem').map(node => node.textContent)).toEqual([
      'Video: My stock video'
    ]);
  });

  it('skips files with blank rights', () => {
    const file = {
      id: 10,
      rights: '',
      configuration: {},
      inlineRights: true
    };

    const {queryAllByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(queryAllByRole('listitem').map(node => node.textContent)).toEqual([]);
  });

  it('renders nothing when all files are filtered', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {}
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(container.textContent).toEqual('');
  });

  it('renders links for for files with source url', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {
        source_url: 'https://stock.example.com/123'
      },
      inlineRights: true
    };

    const {queryByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(queryByRole('link', {name: 'My stock images'}))
      .toHaveAttribute('href', 'https://stock.example.com/123');
  });

  it('renders ai indicator icon and text as part of item', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {
        ai_indicator: 'ai_modified',
        ai_indicator_text: 'Sky replaced'
      },
      inlineRights: true
    };

    const {getByRole, queryByRole} = renderInEntry(
      <InlineFileRights items={[{label: 'image', file}]} />,
      {seed}
    );

    expect(getByRole('listitem')).toHaveTextContent('Image: My stock images Sky replaced');
    expect(queryByRole('img', {name: 'AI modified'})).not.toBeNull();
  });

  it('keeps label, rights and license together for line breaking', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {ai_indicator: 'ai_generated'},
      inlineRights: true,
      license: {
        name: 'CC0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/'
      }
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{label: 'image', file}]} />,
      {seed}
    );

    expect(container.querySelector('[data-part="rights"]'))
      .toHaveTextContent('Image: My stock images (CC0)');
  });

  it('keeps ai indicator icon and text together for line breaking', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {
        ai_indicator: 'ai_modified',
        ai_indicator_text: 'Sky replaced'
      },
      inlineRights: true
    };

    const {container, getByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(getByRole('img', {name: 'AI modified'}).parentElement)
      .toHaveAttribute('data-part', 'ai-indicator');
    expect(container.querySelector('[data-part="ai-indicator"]'))
      .toHaveTextContent('Sky replaced');
  });

  it('renders item for file with ai indicator even without inline rights', () => {
    const file = {
      id: 10,
      rights: '',
      configuration: {
        ai_indicator: 'ai_generated',
        ai_indicator_text: 'Voices cloned'
      },
      inlineRights: false
    };

    const {getByRole} = renderInEntry(
      <InlineFileRights items={[{label: 'video', file}]} />,
      {seed}
    );

    expect(getByRole('listitem')).toHaveTextContent('Video: Voices cloned');
  });

  it('renders one item per file with ai indicator', () => {
    const videoFile = {
      id: 10,
      configuration: {ai_indicator: 'ai_generated', ai_indicator_text: 'Voices'},
      inlineRights: false
    };
    const posterFile = {
      id: 11,
      configuration: {ai_indicator: 'ai_generated', ai_indicator_text: 'Voices'},
      inlineRights: false
    };

    const {queryAllByRole} = renderInEntry(
      <InlineFileRights items={[{label: 'video', file: videoFile},
                                {label: 'poster', file: posterFile}]} />,
      {seed}
    );

    const listItems = queryAllByRole('listitem');

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Video: Voices');
    expect(listItems[1]).toHaveTextContent('Poster: Voices');
  });

  it('marks items that have rights', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {},
      inlineRights: true
    };

    const {getByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(getByRole('listitem')).toHaveAttribute('data-rights', '');
  });

  it('does not mark items that only have an ai indicator', () => {
    const file = {
      id: 10,
      rights: '',
      configuration: {ai_indicator: 'ai_generated'},
      inlineRights: false
    };

    const {getByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(getByRole('listitem')).not.toHaveAttribute('data-rights');
  });

  it('marks labels of items to allow hiding them', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {},
      inlineRights: true
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{label: 'image', file}]} />,
      {seed}
    );

    expect(container.querySelector('[data-label]')).toHaveTextContent('Image:');
  });

  it('does not render license of file without inline rights', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {ai_indicator: 'ai_generated'},
      inlineRights: false,
      license: {
        name: 'CC0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/'
      }
    };

    const {getByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(getByRole('listitem')).not.toHaveTextContent('CC0');
  });

  it('passes flags for rights and ai indicators to widget', () => {
    const file = {
      id: 10,
      rights: '',
      configuration: {ai_indicator: 'ai_generated'},
      inlineRights: false
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed: {widgets: [{role: 'inlineFileRights', typeName: 'inlineFileRightsFlags'}]}}
    );

    expect(container).toHaveTextContent('false|true');
  });

  it('does not render widget for files without rights and ai indicator', () => {
    const file = {
      id: 10,
      rights: '',
      configuration: {},
      inlineRights: true
    };

    const {container} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(container.textContent).toEqual('');
  });

  it('renders license links for for files with license', () => {
    const file = {
      id: 10,
      rights: 'My stock images',
      configuration: {
        license: 'cc0'
      },
      inlineRights: true,
      license: {
        name: 'CC0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/'
      }
    };

    const {queryByRole} = renderInEntry(
      <InlineFileRights items={[{file}]} />,
      {seed}
    );

    expect(queryByRole('link', {name: 'CC0'}))
      .toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/');
  });
});
