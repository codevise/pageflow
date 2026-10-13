require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryLinkSignature do
    it 'accepts signature generated for entry id' do
      signature = EntryLinkSignature.generate(7)

      expect(EntryLinkSignature.valid?(7, signature)).to eq(true)
    end

    it 'rejects signature generated for other entry id' do
      signature = EntryLinkSignature.generate(8)

      expect(EntryLinkSignature.valid?(7, signature)).to eq(false)
    end

    it 'rejects forged signature' do
      expect(EntryLinkSignature.valid?(7, 'forged')).to eq(false)
    end

    it 'rejects missing signature' do
      expect(EntryLinkSignature.valid?(7, nil)).to eq(false)
    end

    it 'rejects non-string signature' do
      expect(EntryLinkSignature.valid?(7, {'some' => 'hash'})).to eq(false)
    end
  end
end
