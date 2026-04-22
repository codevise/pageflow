require 'spec_helper'

require 'pageflow/dom'
require 'pageflow/shared_contexts/fake_translations'
require 'support/dominos/editor'

RSpec.feature 'as entry previewer, commenting on content elements', js: true do
  include_context 'fake translations'

  before do
    translation('en', 'pageflow_scrolled.review.add_comment', 'Add comment')
    translation('en', 'pageflow_scrolled.review.select_content_element', 'Select to comment')
    translation('en', 'pageflow_scrolled.review.select_text_to_comment', 'Select text to comment')
    translation('en', 'pageflow_scrolled.review.resolve', 'Mark as resolved')
    translation('en', 'pageflow_scrolled.review.unresolve', 'Mark as unresolved')
    translation('en', 'pageflow_scrolled.review.resolved_count.one', '1 resolved')
    translation('en', 'pageflow_scrolled.review.resolved_count.other', '%{count} resolved')
  end

  scenario 'sees existing comment badge in entry preview' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'inlineImage')

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

    expect(page).to have_css('[role="status"]', wait: 10)
  end

  scenario 'sees thread comments when clicking badge' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'inlineImage')

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

    find('[role="status"]', wait: 10).click

    expect(page).to have_text('Please review this', wait: 10)
  end

  scenario 'leaves a reply to an existing thread' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'inlineImage')

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

    find('[role="status"]', wait: 10).click
    expect(page).to have_text('Please review this', wait: 10)

    page.find('textarea', match: :first, wait: 10).fill_in(with: 'Looks good!')
    page.find('button[type="submit"]', match: :first).click

    expect(page).to have_text('Looks good!', wait: 10)
  end

  scenario 'creates a new comment thread via add comment mode' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    create(:content_element,
           revision: entry.draft,
           type_name: 'inlineImage')

    Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    visit(pageflow.revision_path(entry.draft))

    find('[aria-label="Add comment"]', wait: 10).click
    find('[aria-label="Select to comment"]', wait: 10).click

    page.find('textarea', match: :first, wait: 10).fill_in(with: 'First comment')
    page.find('button[type="submit"]', match: :first).click

    expect(page).to have_css('[role="status"]', wait: 10)
  end

  scenario 'resolves and unresolves a thread' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    content_element = create(:content_element,
                             revision: entry.draft,
                             type_name: 'inlineImage')

    user = Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    create(:comment_thread,
           revision: entry.draft,
           creator: user,
           subject_type: 'ContentElement',
           subject_id: content_element.perma_id) do |thread|
      create(:comment,
             comment_thread: thread,
             creator: user,
             body: 'Needs work')
    end

    visit(pageflow.revision_path(entry.draft))

    find('[role="status"]', wait: 10).click
    expect(page).to have_text('Needs work', wait: 10)

    click_button('Mark as resolved')

    expect(page).to have_text('1 resolved', wait: 10)
    expect(page).not_to have_text('Needs work')

    click_button('1 resolved')
    expect(page).to have_text('Needs work', wait: 10)

    click_button('Mark as unresolved')

    expect(page).not_to have_text('1 resolved', wait: 10)
    expect(page).to have_text('Needs work')
  end

  scenario 'shows select text hint for text block elements in add comment mode' do
    entry = create(:entry, :published, type_name: 'scrolled',
                                       with_feature: 'commenting',
                                       draft_attributes: {locale: 'en'})
    create(:content_element,
           revision: entry.draft,
           type_name: 'textBlock',
           configuration: {
             value: [{
               'type' => 'paragraph',
               'children' => [{'text' => 'Some example text to comment on'}]
             }]
           })

    Pageflow::Dom::Admin::Page.sign_in_as(:previewer, on: entry)

    visit(pageflow.revision_path(entry.draft))

    find('[aria-label="Add comment"]', wait: 10).click

    expect(page).to have_text('Select text to comment', wait: 10)
  end
end
