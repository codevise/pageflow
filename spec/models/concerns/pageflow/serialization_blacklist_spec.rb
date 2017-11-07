require 'spec_helper'

module Pageflow
  describe SerializationBlacklist do
    let(:model) do
      Class.new(ActiveRecord::Base) do
        self.table_name = 'pageflow_entries'

        include SerializationBlacklist

        def self.name
          'Entry'
        end

        def blacklist_for_serialization
          [:password_digest]
        end
      end
    end

    it 'includes non sensitive data' do
      entry = model.new(title: 'some title')

      expect(entry.to_json).to include('some title')
    end

    it 'supports excluding attributes' do
      entry = model.new(title: 'some title')

      expect(entry.to_json(except: :title)).not_to include('some title')
    end

    it 'does not include sensitive data in json' do
      entry = model.new(password_digest: 'secret')

      expect(entry.to_json).not_to include('secret')
    end

    it 'does not include sensitive data in xml' do
      entry = model.new(password_digest: 'secret')

      expect(entry.to_xml).not_to include('secret')
    end

    it 'excludes sensitive data even if except option is passed' do
      entry = model.new(password_digest: 'secret')

      expect(entry.to_json(except: :title)).not_to include('secret')
    end
  end
end
