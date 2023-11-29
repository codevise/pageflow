require 'spec_helper'

module Pageflow
  describe 'EntryPublicationStates' do
    describe '#publication_state' do
      it 'identifies entry published with noindex' do
        entry = create(:entry, :published_with_noindex)

        expect(entry.publication_state).to eq('published_with_noindex')
      end

      it 'identifies entry published without password protection' do
        entry = create(:entry, :published)

        expect(entry.publication_state).to eq('published_without_password_protection')
      end

      it 'identifies entry published with password protection' do
        entry = create(:entry, :published_with_password)

        expect(entry.publication_state).to eq('published_with_password_protection')
      end

      it 'identifies non published entry' do
        entry = create(:entry)

        expect(entry.publication_state).to eq('not_published')
      end
    end

    describe '#last_published_with_noindex?' do
      it 'returns false if entry has never been published' do
        entry = create(:entry)

        expect(entry.last_published_with_noindex?).to eq(false)
      end

      it 'returns true if entry is published with noindex' do
        entry = create(:entry, :published_with_noindex)

        expect(entry.last_published_with_noindex?).to eq(true)
      end

      it 'returns true if most recent publication with noindex' do
        entry = create(:entry, :published_with_noindex)
        entry.revisions.depublish_all

        expect(entry.last_published_with_noindex?).to eq(true)
      end

      it 'returns false if most recent publication without noindex' do
        entry = create(:entry, :published_with_noindex)
        entry.publish(creator: create(:user), noindex: false)

        expect(entry.last_published_with_noindex?).to eq(false)
      end
    end

    describe '.published' do
      it 'includes published entries without password protection' do
        entry = create(:entry, :published)

        result = Entry.published

        expect(result).to include(entry)
      end

      it 'does not include non published entries' do
        entry = create(:entry)

        result = Entry.published

        expect(result).not_to include(entry)
      end

      it 'includes published entries with password protection' do
        entry = create(:entry, :published_with_password)

        result = Entry.published

        expect(result).to include(entry)
      end
    end

    describe '.published_without_password_protection' do
      it 'includes published entries without password protection' do
        entry = create(:entry, :published)

        result = Entry.published_without_password_protection

        expect(result).to include(entry)
      end

      it 'does not include non published entries' do
        entry = create(:entry)

        result = Entry.published_without_password_protection

        expect(result).not_to include(entry)
      end

      it 'does not include published entries with password protection' do
        entry = create(:entry, :published_with_password)

        result = Entry.published_without_password_protection

        expect(result).not_to include(entry)
      end
    end

    describe '.published_with_password_protection' do
      it 'does not includes published entries without password protection' do
        entry = create(:entry, :published)

        result = Entry.published_with_password_protection

        expect(result).not_to include(entry)
      end

      it 'does not include non published entries' do
        entry = create(:entry)

        result = Entry.published_with_password_protection

        expect(result).not_to include(entry)
      end

      it 'includes published entries with password protection' do
        entry = create(:entry, :published_with_password)

        result = Entry.published_with_password_protection

        expect(result).to include(entry)
      end
    end

    describe '.not_published' do
      it 'does not include published entries without password protection' do
        entry = create(:entry, :published)

        result = Entry.not_published

        expect(result).not_to include(entry)
      end

      it 'includes non published entries' do
        entry = create(:entry)

        result = Entry.not_published

        expect(result).to include(entry)
      end

      it 'does not include published entries with password protection' do
        entry = create(:entry, :published_with_password)

        result = Entry.not_published

        expect(result).not_to include(entry)
      end
    end

    describe '.with_publication_state' do
      describe 'not_published' do
        it 'includes non published entries' do
          entry = create(:entry)

          result = Entry.with_publication_state('not_published')

          expect(result).to include(entry)
        end

        it 'does not include non published entries' do
          entry = create(:entry, :published)

          result = Entry.with_publication_state('not_published')

          expect(result).not_to include(entry)
        end
      end

      describe 'published_with_password_protection' do
        it 'includes published entries with password protection' do
          entry = create(:entry, :published_with_password)

          result = Entry.with_publication_state('published_with_password_protection')

          expect(result).to include(entry)
        end

        it 'does not include published entries without password protection' do
          entry = create(:entry, :published)

          result = Entry.with_publication_state('published_with_password_protection')

          expect(result).not_to include(entry)
        end
      end

      describe 'published_without_password_protection' do
        it 'includes published entries without password protection' do
          entry = create(:entry, :published)

          result = Entry.with_publication_state('published_without_password_protection')

          expect(result).to include(entry)
        end

        it 'does not include published entries with password protection' do
          entry = create(:entry, :published_with_password)

          result = Entry.with_publication_state('published_without_password_protection')

          expect(result).not_to include(entry)
        end
      end

      describe 'for unknown publication state' do
        it 'raises argument error' do
          expect {
            Entry.with_publication_state('unknown')
          }.to raise_error(ArgumentError)
        end
      end
    end
  end
end
