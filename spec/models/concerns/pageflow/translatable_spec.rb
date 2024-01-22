require 'spec_helper'

module Pageflow
  describe Translatable do
    describe '#mark_as_translation_of' do
      it 'adds entries to new translation group' do
        entry = create(:entry)
        other_entry = create(:entry)

        entry.mark_as_translation_of(other_entry)

        expect(entry.translations).to include(other_entry)
        expect(other_entry.translations).to include(entry)
      end

      it 'makes first entry of group the default translation' do
        entry = create(:entry)
        other_entry = create(:entry)

        entry.mark_as_translation_of(other_entry)

        expect(entry.default_translation?).to eq(true)
      end

      it 'adds entry to existing translation group of other entry' do
        entry = create(:entry)
        fr_entry = create(:entry)
        de_entry = create(:entry)

        fr_entry.mark_as_translation_of(entry)
        de_entry.mark_as_translation_of(entry)

        expect(entry.translations).to include(fr_entry)
        expect(entry.translations).to include(de_entry)
      end

      it 'adds entry to own existing translation group' do
        entry = create(:entry)
        fr_entry = create(:entry)
        de_entry = create(:entry)

        de_entry.mark_as_translation_of(entry)
        entry.mark_as_translation_of(fr_entry)

        expect(entry.translations).to include(fr_entry)
        expect(entry.translations).to include(de_entry)
      end

      it 'merges translation groups' do
        en_entry = create(:entry)
        pl_entry = create(:entry)
        fr_entry = create(:entry)
        de_entry = create(:entry)

        en_entry.mark_as_translation_of(pl_entry)
        fr_entry.mark_as_translation_of(de_entry)
        fr_entry.mark_as_translation_of(pl_entry)

        expect(en_entry.reload.translations).to include(pl_entry)
        expect(en_entry.reload.translations).to include(de_entry)
        expect(fr_entry.reload.translations).to include(pl_entry)
        expect(EntryTranslationGroup.count).to eq(1)
      end
    end

    describe '#remove_from_translation_group' do
      it 'sets translation group to nil' do
        translation_group = create(:entry_translation_group)
        en_entry = create(:entry, translation_group:)
        pl_entry = create(:entry, translation_group:)
        fr_entry = create(:entry, translation_group:)

        en_entry.remove_from_translation_group

        expect(pl_entry.translations).to eq([pl_entry, fr_entry])
      end

      it 'resets default translation' do
        translation_group = create(:entry_translation_group)
        entry = create(:entry, translation_group:)
        create(:entry, translation_group:)
        create(:entry, translation_group:)

        entry.mark_as_default_translation
        entry.remove_from_translation_group

        expect(translation_group.default_translation).to be_nil
      end

      it 'destroys translation group with only one entry' do
        translation_group = create(:entry_translation_group)
        en_entry = create(:entry, translation_group:)
        fr_entry = create(:entry, translation_group:)

        en_entry.remove_from_translation_group

        expect(fr_entry.translations).to eq([])
        expect(fr_entry.reload.translation_group_id).to eq(nil)
        expect(EntryTranslationGroup.count).to eq(0)
      end
    end

    it 'destroying the penultimate entry in a translation group destroys the group' do
      translation_group = create(:entry_translation_group)
      en_entry = create(:entry, translation_group:)
      fr_entry = create(:entry, translation_group:)

      en_entry.destroy

      expect(fr_entry.translations).to eq([])
      expect(fr_entry.reload.translation_group_id).to eq(nil)
      expect(EntryTranslationGroup.count).to eq(0)
    end

    it 'destroying an entry does not destroy translation group with multiple entries' do
      translation_group = create(:entry_translation_group)
      en_entry = create(:entry, translation_group:)
      fr_entry = create(:entry, translation_group:)
      pl_entry = create(:entry, translation_group:)

      en_entry.destroy

      expect(fr_entry.translations).to eq([fr_entry, pl_entry])
    end

    it 'destroying the default translations resets the association' do
      translation_group = create(:entry_translation_group)
      entry = create(:entry, translation_group:)
      create(:entry, translation_group:)
      create(:entry, translation_group:)

      entry.mark_as_default_translation
      entry.destroy

      expect(translation_group.default_translation).to be_nil
    end

    it 'allows destroying an entry without translation group' do
      entry = create(:entry)

      expect {
        entry.destroy
      }.not_to raise_error
    end
  end

  describe '#mark_as_default_translation' do
    it 'updates translation group' do
      translation_group = create(:entry_translation_group)
      entry = create(:entry, translation_group:)

      entry.mark_as_default_translation

      expect(translation_group.reload.default_translation).to eq(entry)
    end
  end

  describe '#default_translation?' do
    it 'returns false by default' do
      entry = create(:entry)

      expect(entry.default_translation?).to eq(false)
    end

    it 'returns true once marked as default' do
      translation_group = create(:entry_translation_group)
      entry = create(:entry, translation_group:)

      entry.mark_as_default_translation

      expect(entry.default_translation?).to eq(true)
    end
  end
end
