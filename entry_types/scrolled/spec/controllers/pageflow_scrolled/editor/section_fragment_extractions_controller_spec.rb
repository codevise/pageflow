require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::SectionFragmentExtractionsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        post_extraction(entry:, sections: [section])

        expect(response.status).to eq(401)
      end

      it 'copies sections into fragment of library' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        section = create(:section, revision: entry.draft, configuration: {'layout' => 'left'})

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section], title: 'Intro')

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(response.status).to eq(201)
        expect(fragment.configuration).to eq('title' => 'Intro')
        expect(fragment.sections.map(&:configuration)).to match([include('layout' => 'left')])
      end

      it 'copies sections in document order' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        first_chapter = create(:scrolled_chapter, revision: entry.draft, position: 0)
        second_chapter = create(:scrolled_chapter, revision: entry.draft, position: 1)
        second_section = create(:section, chapter: second_chapter,
                                          configuration: {'layout' => 'right'})
        first_section = create(:section, chapter: first_chapter,
                                         configuration: {'layout' => 'left'})

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [second_section, first_section])

        expect(Section.all_for_revision(find_library(account).draft)
                 .map { |section| section.configuration['layout'] })
          .to eq(%w[left right])
      end

      it 'does not let user who may not edit library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        section = create(:section, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section])

        expect(response.status).to eq(403)
        expect(find_library(account)).to be_nil
      end

      it 'lets user with editor role on existing library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        section = create(:section, revision: entry.draft)
        library = create(:entry,
                         type_name: 'scrolled',
                         account:,
                         fragment_library: 'shared',
                         with_editor: user)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section])

        expect(response.status).to eq(201)
        expect(Chapter.all_for_revision(library.draft).count).to eq(1)
      end

      it 'does not let user who may not edit existing library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        section = create(:section, revision: entry.draft)
        library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section])

        expect(response.status).to eq(403)
        expect(Chapter.all_for_revision(library.draft)).to be_empty
      end

      it 'responds with not found for section of other entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        other_entry = create(:entry, type_name: 'scrolled', account:)
        section = create(:section, revision: entry.draft)
        other_section = create(:section, revision: other_entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section, other_section])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end

      it 'responds with not found without sections' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:)
        section = create(:section, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, sections: [section])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end
    end

    def find_library(account)
      Pageflow::Entry.find_by(account:, fragment_library: 'shared')
    end

    def post_extraction(entry:, sections:, title: nil)
      post(:create,
           params: {
             entry_type: 'scrolled',
             entry_id: entry,
             section_ids: sections.map(&:id),
             title:
           }.compact, format: 'json')
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
