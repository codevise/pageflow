require 'spec_helper'
require 'pageflow/editor_controller_test_helper'
require 'pageflow/shared_contexts/fake_translations'

module PageflowScrolled
  RSpec.describe Editor::FragmentExtractionsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        post_extraction(entry:, chapter:)

        expect(response.status).to eq(401)
      end

      it 'creates fragment library for account of entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        sign_in_and_lock(entry, user)

        expect { post_extraction(entry:, chapter:) }
          .to change { Pageflow::Entry.where(account:, fragment_library: 'shared').count }.by(1)
        expect(response.status).to eq(201)
      end

      it 'creates scrolled library entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(find_library(account).type_name).to eq('scrolled')
      end

      describe 'library title' do
        include_context 'fake translations'

        it 'includes account name in locale of entry' do
          translation(:de, 'pageflow_scrolled.fragment_library.title',
                      'Bausteine von %{account_name}')
          translation(:en, 'pageflow_scrolled.fragment_library.title',
                      'Shared fragments of %{account_name}')
          user = create(:user)
          account = create(:account, name: 'Acme', with_editor: user)
          entry = create(:entry,
                         type_name: 'scrolled',
                         account:,
                         with_feature: 'fragments',
                         draft_attributes: {locale: 'de'})
          chapter = create(:scrolled_chapter, revision: entry.draft)

          sign_in_and_lock(entry, user)
          post_extraction(entry:, chapter:)

          expect(find_library(account).title).to eq('Bausteine von Acme')
        end

        it 'falls back to English for other locales' do
          translation(:de, 'pageflow_scrolled.fragment_library.title',
                      'Bausteine von %{account_name}')
          translation(:en, 'pageflow_scrolled.fragment_library.title',
                      'Shared fragments of %{account_name}')
          user = create(:user)
          account = create(:account, name: 'Acme', with_editor: user)
          entry = create(:entry,
                         type_name: 'scrolled',
                         account:,
                         with_feature: 'fragments',
                         draft_attributes: {locale: 'fr'})
          chapter = create(:scrolled_chapter, revision: entry.draft)

          sign_in_and_lock(entry, user)
          post_extraction(entry:, chapter:)

          expect(find_library(account).title).to eq('Shared fragments of Acme')
        end
      end

      it 'copies chapter with its sections into library' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter,
                         revision: entry.draft,
                         configuration: {'title' => 'Intro', 'kind' => 'intro'})
        create(:section, chapter:, position: 0)
        create(:section, chapter:, position: 1)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(fragment.configuration).to include('title' => 'Intro', 'kind' => 'intro')
        expect(fragment.sections.count).to eq(2)
      end

      it 'uses given title for fragment' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter,
                         revision: entry.draft,
                         configuration: {'title' => 'Intro', 'kind' => 'intro'})

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:, title: 'Opening with video')

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(fragment.configuration).to include('title' => 'Opening with video',
                                                  'kind' => 'intro')
      end

      it 'keeps chapter title if blank title is given' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter,
                         revision: entry.draft,
                         configuration: {'title' => 'Intro'})

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:, title: ' ')

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(fragment.configuration).to include('title' => 'Intro')
      end

      it 'adds fragment to main storyline of library' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(fragment.storyline.configuration).to include('main' => true)
      end

      it 'keeps sections of chapter in entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        create(:section, chapter:)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(chapter.sections.count).to eq(1)
      end

      it 'appends fragment to existing library of account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter,
                         revision: entry.draft,
                         configuration: {'title' => 'Outro'})
        library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        create(:scrolled_chapter,
               revision: library.draft,
               position: 0,
               configuration: {'title' => 'Intro'})

        sign_in_and_lock(entry, user)

        expect { post_extraction(entry:, chapter:) }
          .not_to(change { Pageflow::Entry.where(fragment_library: 'shared').count })
        expect(Chapter.all_for_revision(library.draft).map { |c| c.configuration['title'] })
          .to eq(%w[Intro Outro])
      end

      it 'does not add fragment to library of other account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        other_account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        other_library = create(:entry,
                               type_name: 'scrolled',
                               account: other_account,
                               fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(Chapter.all_for_revision(other_library.draft)).to be_empty
        expect(find_library(account)).to be_present
      end

      it 'does not let user without account editor role create library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(response.status).to eq(403)
        expect(find_library(account)).to be_nil
      end

      it 'lets user with editor role on existing library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        library = create(:entry,
                         type_name: 'scrolled',
                         account:,
                         fragment_library: 'shared',
                         with_editor: user)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(response.status).to eq(201)
        expect(Chapter.all_for_revision(library.draft).count).to eq(1)
      end

      it 'does not let user who may not edit existing library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(response.status).to eq(403)
        expect(Chapter.all_for_revision(library.draft)).to be_empty
      end

      it 'responds with not found for chapter of other entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        other_entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: other_entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(response.status).to eq(404)
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:)
        chapter = create(:scrolled_chapter, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, chapter:)

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end
    end

    def find_library(account)
      Pageflow::Entry.find_by(account:, fragment_library: 'shared')
    end

    def post_extraction(entry:, chapter:, title: nil)
      post(:create,
           params: {
             entry_type: 'scrolled',
             entry_id: entry,
             chapter_id: chapter,
             title:
           }.compact, format: 'json')
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
