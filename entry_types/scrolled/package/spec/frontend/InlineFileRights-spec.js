import React from 'react';

import {InlineFileRights} from 'frontend/InlineFileRights';
import {api} from 'frontend/api';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('InlineFileRights', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.inline_file_rights_labels.poster': 'Poster',
    'pageflow_scrolled.public.inline_file_rights_labels.video': 'Video',
  });

  beforeEach(() => {
    api.widgetTypes.register('inlineFileRightsWrapper', {
      component: function ({children}) {
        return (
          <div>Rights: {children}</div>
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
      component: function ({children, context, playerControlsTransparent, playerControlsStandAlone}) {
        return (
          <div>
            {context} {playerControlsTransparent.toString()} {playerControlsStandAlone.toString()}
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
                        playerControlsTransparent={false}
                        playerControlsStandAlone={true} />,
      {
        seed: {
          widgets: [{role: 'inlineFileRights', typeName: 'inlineFileRightsWithProps'}]
        }
      }
    );

    expect(container).toHaveTextContent('playerControls false true');
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
