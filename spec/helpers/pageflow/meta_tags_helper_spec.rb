require 'spec_helper'

module Pageflow
  RSpec.describe MetaTagsHelper, type: :helper do
    let(:entry) { create(:entry, :published) }
    let(:published_entry) { PublishedEntry.new(entry) }

    it 'renders default keywords from configuration' do
      html = helper.meta_tags_for_entry(published_entry)
      expect(html).to have_css(
        %{meta[content="pageflow, multimedia, reportage"][name="keywords"]},
        visible: false,
        count: 1
      )
    end

    it 'renders default author from configuration' do
      html = helper.meta_tags_for_entry(published_entry)
      expect(html).to have_css(
        %{meta[content="Pageflow"][name="author"]},
        visible: false,
        count: 1
      )
    end

    it 'renders default publisher from configuration' do
      html = helper.meta_tags_for_entry(published_entry)
      expect(html).to have_css(
        %{meta[content="Pageflow"][name="publisher"]},
        visible: false,
        count: 1
      )
    end
  end
end
