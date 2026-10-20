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

    it 'accepts signature generated for chapter of entry' do
      signature = EntryLinkSignature.generate(7, chapter: 10)

      expect(EntryLinkSignature.valid?(7, signature, chapter: 10)).to eq(true)
    end

    it 'rejects signature generated for other chapter' do
      signature = EntryLinkSignature.generate(7, chapter: 11)

      expect(EntryLinkSignature.valid?(7, signature, chapter: 10)).to eq(false)
    end

    it 'rejects signature generated for entry when used for chapter' do
      signature = EntryLinkSignature.generate(7)

      expect(EntryLinkSignature.valid?(7, signature, chapter: 10)).to eq(false)
    end

    it 'accepts signature generated for section of entry' do
      signature = EntryLinkSignature.generate(7, section: 20)

      expect(EntryLinkSignature.valid?(7, signature, section: 20)).to eq(true)
    end

    it 'rejects signature generated for chapter with same perma id when used for section' do
      signature = EntryLinkSignature.generate(7, chapter: 20)

      expect(EntryLinkSignature.valid?(7, signature, section: 20)).to eq(false)
    end
  end
end
