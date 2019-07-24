require 'spec_helper'

module Pageflow
  describe AudioFile do
    include_examples 'media encoding state machine', :audio_file

    describe '#meta_data_attributes=' do
      it 'assigns format and duration_in_ms' do
        audio_file = build(:audio_file)

        audio_file.meta_data_attributes = {:format => 'ogg', :duration_in_ms => 1000}

        expect(audio_file.format).to eq('ogg')
        expect(audio_file.duration_in_ms).to eq(1000)
      end
    end
  end
end
