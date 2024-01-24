require 'spec_helper'

module Pageflow
  describe PotentialEntryTranslations do
    it 'allows filtering by title' do
      entry_de = create(
        :entry,
        title: 'Some story DE'
      )
      entry_en = create(
        :entry,
        title: 'Some story EN',
        account: entry_de.account
      )
      other_entry_en = create(
        :entry,
        title: 'Other story EN',
        account: entry_de.account
      )
      query = PotentialEntryTranslations.for(entry_de)

      result = query.resolve.ransack(title_cont: 'story EN').result

      expect(result).to eq([other_entry_en, entry_en])
    end

    it 'excludes entry itself' do
      entry_de = create(
        :entry,
        title: 'Some story DE'
      )
      entry_en = create(
        :entry,
        title: 'Some story EN',
        account: entry_de.account
      )
      query = PotentialEntryTranslations.for(entry_de)

      result = query.resolve.ransack(title_cont: 'story').result

      expect(result).to eq([entry_en])
    end

    it 'represents translation group with matching entry by single entry' do
      entry_de = create(
        :entry,
        title: 'Some story DE'
      )
      translation_group = create(:entry_translation_group)
      entry_en = create(
        :entry,
        title: 'Some story EN',
        account: entry_de.account,
        translation_group:
      )
      create(
        :entry,
        title: 'Some story FR',
        account: entry_de.account,
        translation_group:
      )
      query = PotentialEntryTranslations.for(entry_de)

      result = query.resolve.ransack(title_cont: 'story').result

      expect(result).to eq([entry_en])
      expect(result[0].association(:translation_group)).to be_loaded
      expect(result[0].translation_group.entries).to be_loaded
    end

    it 'excludes entry representing current translation group' do
      translation_group = create(:entry_translation_group)
      entry_de = create(
        :entry,
        title: 'Some story DE',
        translation_group:
      )
      create(
        :entry,
        title: 'Some story EN',
        account: entry_de.account,
        translation_group:
      )
      entry_fr = create(
        :entry,
        title: 'Some story FR',
        account: entry_de.account
      )
      query = PotentialEntryTranslations.for(entry_de)

      result = query.resolve.ransack(title_cont: 'story').result

      expect(result).to eq([entry_fr])
    end
  end
end
