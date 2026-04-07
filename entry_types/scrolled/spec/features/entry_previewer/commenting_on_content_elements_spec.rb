require 'spec_helper'

require 'pageflow/dom'
require 'support/dominos/editor'

RSpec.feature 'as entry previewer, commenting on content elements', js: true do
  scenario 'sees existing comment badge in entry preview' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting')
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'textBlock',
                             configuration: {
                               value: [{type: 'paragraph',
                                        children: [{text: 'Some text'}]}]
                             })

    user = Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    create(:comment_thread,
           revision: entry.draft,
           creator: user,
           subject_type: 'ContentElement',
           subject_id: content_element.perma_id) do |thread|
      create(:comment,
             comment_thread: thread,
             creator: user,
             body: 'Please review this paragraph')
    end

    visit(pageflow.revision_path(entry.draft))

    expect(page).to have_text('Some text', wait: 10)
    expect(page).to have_css('[role="status"]', text: '1', wait: 10)
  end

  scenario 'sees thread comments when clicking badge' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting')
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'textBlock',
                             configuration: {
                               value: [{type: 'paragraph',
                                        children: [{text: 'Some text'}]}]
                             })

    user = Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    create(:comment_thread,
           revision: entry.draft,
           creator: user,
           subject_type: 'ContentElement',
           subject_id: content_element.perma_id) do |thread|
      create(:comment,
             comment_thread: thread,
             creator: user,
             body: 'Please review this')
    end

    visit(pageflow.revision_path(entry.draft))

    find('[role="status"]', text: '1', wait: 10).click

    expect(page).to have_text('Please review this', wait: 10)
  end

  scenario 'creates a new comment thread' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting')
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'textBlock',
                             configuration: {
                               value: [{type: 'paragraph',
                                        children: [{text: 'Some text'}]}]
                             })

    user = Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    create(:comment_thread,
           revision: entry.draft,
           creator: user,
           subject_type: 'ContentElement',
           subject_id: content_element.perma_id) do |thread|
      create(:comment, comment_thread: thread, creator: user, body: 'Existing')
    end

    visit(pageflow.revision_path(entry.draft))

    find('[role="status"]', text: '1', wait: 10).click

    page.find('textarea', match: :first, wait: 10).fill_in(with: 'Another topic')
    page.find('button[type="submit"]', match: :first).click

    expect(page).to have_css('[role="status"]', text: '2', wait: 10)
  end
end
