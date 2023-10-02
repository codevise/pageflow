require 'spec_helper'

module Pageflow
  describe NewsItemApi do
    let(:pageflow_module) do
      Module.new do
        extend GlobalConfigApi
        extend NewsItemApi
      end
    end

    describe '.news_item' do
      it 'calls config.news.item after global configuration' do
        news = double('news', item: nil)

        pageflow_module.news_item(:some_news_item, message: '')
        pageflow_module.configure do |config|
          config.news = news
        end
        pageflow_module.finalize!
        pageflow_module.configure!

        expect(news).to have_received(:item).with(:some_news_item, message: '')
      end

      it 'does not fail if config.news is not set' do
        pageflow_module.news_item(:some_news_item, {})

        expect {
          pageflow_module.finalize!
        }.not_to raise_error
      end
    end
  end
end
