require 'spec_helper'

module PageflowScrolled
  RSpec.describe Seeds do
    module SeedsDsl
      extend Seeds
    end

    describe '#sample_scrolled_entry' do
      it 'creates entry for account' do
        entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                               title: 'Example',
                                               sections: [])

        expect(entry).to be_persisted
      end

      it 'does not create entry if entry with same title exists for account' do
        account = create(:account)
        entry = create(:entry,
                       type_name: 'scrolled',
                       account: account,
                       title: 'Example')

        result = SeedsDsl.sample_scrolled_entry(account: account,
                                                title: 'Example',
                                                sections: [])

        expect(result).to eq(entry)
      end

      it 'creates sections as specified' do
        entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                               title: 'Example',
                                               sections: [
                                                 {'transition' => 'scroll', 'foreground' => []}
                                               ])

        created_section = Section.all_for_revision(entry.draft).first
        expect(created_section.configuration['transition']).to eq('scroll')
      end

      it 'creates the sections content_elements as specified' do
        content_element_config = {
          'type' => 'heading',
          'props' => {
            children: 'Pageflow Next'
          }
        }
        entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                               title: 'Example',
                                               sections: [
                                                 {'foreground' => [content_element_config]}
                                               ])

        created_section = Section.all_for_revision(entry.draft).first
        created_content_element = created_section.content_elements.first
        expect(created_content_element.type_name).to eq('heading')
        expect(created_content_element.configuration).to eq('children' => 'Pageflow Next')
      end

      it 'allows overriding attributes in block' do
        account = create(:account)
        theming = create(:theming, account: account)

        entry = SeedsDsl.sample_scrolled_entry(account: account,
                                               title: 'Example',
                                               sections: []) do |created_entry|
          created_entry.theming = theming
        end

        expect(entry.theming).to eq(theming)
      end
    end
  end
end
