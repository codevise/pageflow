require 'spec_helper'

module Pageflow
  describe RenderJsonHelper do
    describe '#render_json_partial' do
      it 'returns JSON created by jbuilder partial' do
        stub_template('some/_partial.json.jbuilder' => 'json.some "data"')

        result = helper.render_json_partial('some/partial')

        expect(JSON.parse(result)).to eq('some' => 'data')
      end

      it 'allows passing locals' do
        stub_template('some/_partial.json.jbuilder' => 'json.some some_local')

        result = helper.render_json_partial('some/partial', some_local: 'data')

        expect(JSON.parse(result)).to eq('some' => 'data')
      end
    end

    describe '#render_json' do
      it 'invokes block with JBuilder object' do
        result = helper.render_json do |json|
          json.some 'data'
        end

        expect(JSON.parse(result)).to eq('some' => 'data')
      end
    end

    describe '#sanitize_json' do
      it 'escapes illegal characters' do
        result = helper.sanitize_json(%q({"key": "some\u2028text"}))

        expect(result).to include('some\\u2028text')
      end

      it 'escapes closing tags' do
        result = helper.sanitize_json('{"key": "</script>"}')

        # Changed in jbuilder 2.9
        expect(result).to include('<\/script>').or include('\\u003c/script\\u003e')
      end
    end
  end
end
