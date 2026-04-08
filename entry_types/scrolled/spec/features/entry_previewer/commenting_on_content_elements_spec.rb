require 'spec_helper'

require 'pageflow/dom'
require 'pageflow/shared_contexts/fake_translations'
require 'support/dominos/editor'

RSpec.feature 'as entry previewer, commenting on content elements', js: true do
  include_context 'fake translations'

  before do
    translation('en', 'pageflow_scrolled.review.add_comment', 'Add comment')
    translation('en', 'pageflow_scrolled.review.select_content_element', 'Select to comment')
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
end
