require 'spec_helper'

module Pageflow
  describe EntriesControllerEnvHelper do
    describe '#get_published_entry_from_env' do
      it 'reads entry from where add_entry_info_to_env puts it' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_entry_info_to_env(env, entry:)
        result = EntriesControllerEnvHelper.get_published_entry_from_env(env)

        expect(result).to eq(entry)
      end

      it 'fails with a helpful message when info is missing in env' do
        expect {
          EntriesControllerEnvHelper.get_published_entry_from_env({})
        }.to raise_error(/Use Pageflow::EntriesControllerTestHelper/)
      end
    end

    describe '#get_entry_mode_from_env' do
      it 'reads mode from where add_entry_info_to_env puts it' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_entry_info_to_env(env, entry:, mode: :preview)
        result = EntriesControllerEnvHelper.get_entry_mode_from_env(env)

        expect(result).to eq(:preview)
      end

      it 'fails with a helpful message when info is missing in env' do
        expect {
          EntriesControllerEnvHelper.get_published_entry_from_env({})
        }.to raise_error(/Use Pageflow::EntriesControllerTestHelper/)
      end
    end

    describe '#get_ui_locale_from_env' do
      it 'reads ui locale from where add_entry_info_to_env puts it' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_entry_info_to_env(env, entry:, ui_locale: :de)
        result = EntriesControllerEnvHelper.get_ui_locale_from_env(env)

        expect(result).to eq(:de)
      end

      it 'returns nil if no ui locale has been passed' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_entry_info_to_env(env, entry:)
        result = EntriesControllerEnvHelper.get_ui_locale_from_env(env)

        expect(result).to be_nil
      end

      it 'fails with a helpful message when info is missing in env' do
        expect {
          EntriesControllerEnvHelper.get_ui_locale_from_env({})
        }.to raise_error(/Use Pageflow::EntriesControllerTestHelper/)
      end
    end

    describe '#get_embed_from_env' do
      it 'reads embed from where add_entry_info_to_env puts it' do
        env = {}
        entry = build(:entry)

        EntriesControllerEnvHelper.add_entry_info_to_env(env, entry:, embed: true)
        result = EntriesControllerEnvHelper.get_embed_from_env(env)

        expect(result).to be(true)
      end

      it 'fails with a helpful message when info is missing in env' do
        expect {
          EntriesControllerEnvHelper.get_embed_from_env({})
        }.to raise_error(/Use Pageflow::EntriesControllerTestHelper/)
      end
    end
  end
end
