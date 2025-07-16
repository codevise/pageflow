require 'spec_helper'
require 'pageflow/caching_test_helpers'

module PageflowScrolled
  RSpec.describe CacheHelper, type: :helper do
    describe '#cache_scrolled_entry', :use_clean_rails_memory_store_fragment_caching do
      it 'caches if feature is enabled and entry is published' do
        entry = create(:published_entry,
                       with_feature: 'scrolled_entry_fragment_caching')

        result = 'initial value'

        helper.cache_scrolled_entry(entry:, widget_scope: :published) { result = 'old value' }
        helper.cache_scrolled_entry(entry:, widget_scope: :published) { result = 'new value' }

        expect(result).to eq('old value')
      end

      it "doesn't cache if feature is disabled" do
        entry = create(:published_entry)

        result = 'initial value'

        helper.cache_scrolled_entry(entry:, widget_scope: :published) { result = 'old value' }
        helper.cache_scrolled_entry(entry:, widget_scope: :published) { result = 'new value' }

        expect(result).to eq('new value')
      end

      it "doesn't cache if widget_scope isn't :published" do
        # would typically imply widget scope :published
        entry = create(:published_entry,
                       with_feature: 'scrolled_entry_fragment_caching')

        result = 'initial value'

        helper.cache_scrolled_entry(entry:, widget_scope: :editor) { result = 'old value' }
        helper.cache_scrolled_entry(entry:, widget_scope: :editor) { result = 'new value' }

        expect(result).to eq('new value')
      end

      it 'caches for different values of widget scope' do
        entry = create(:published_entry,
                       with_feature: 'scrolled_entry_fragment_caching')

        result = 'initial value'
        published_result = 'initial value'

        helper.cache_scrolled_entry(entry:, widget_scope: :published) do
          result = 'oldest value', published_result = 'oldest value'
        end
        helper.cache_scrolled_entry(entry:, widget_scope: :editor) { result = 'old value' }
        helper.cache_scrolled_entry(entry:, widget_scope: :published) do
          result = 'new value', published_result = 'new value'
        end
        helper.cache_scrolled_entry(entry:, widget_scope: :editor) { result = 'newest value' }

        expect(result).to eq('newest value')
        expect(published_result).to eq('oldest value')
      end
    end
  end
end
