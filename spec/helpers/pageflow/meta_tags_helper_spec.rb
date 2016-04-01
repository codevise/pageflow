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

    it 'allows default keywords being set from configuration' do
      pageflow_configure { |config| config.default_keywords_meta_tag = 'story, environment' }

      html = helper.meta_tags_for_entry(published_entry)

      expect(html).to have_css(
        %{meta[content="story, environment"][name="keywords"]},
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

    it 'allows author being set from configuration' do
      pageflow_configure { |config| config.default_author_meta_tag = 'Acme, Inc.' }

      html = helper.meta_tags_for_entry(published_entry)

      expect(html).to have_css(
        %{meta[content="Acme, Inc."][name="author"]},
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

    it 'allows publisher being set from configuration' do
      pageflow_configure { |config| config.default_publisher_meta_tag = 'Acme, Inc.' }

      html = helper.meta_tags_for_entry(published_entry)

      expect(html).to have_css(
        %{meta[content="Acme, Inc."][name="publisher"]},
        visible: false,
        count: 1
      )
    end
  end
end
