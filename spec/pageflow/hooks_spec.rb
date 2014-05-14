require 'spec_helper'

module Pageflow
  describe Hooks do
    describe '#invoke' do
      it 'sends #call to all subscribers' do
        hooks = Hooks.new
        subscriber = double('subscriber', call: true)
        hooks.on(:encode_file, subscriber)

        hooks.invoke(:encode_file)

        expect(subscriber).to have_received(:call)
      end

      it 'does not send #call to subscriber of other event' do
        hooks = Hooks.new
        subscriber = double('subscriber', call: true)
        hooks.on(:other, subscriber)

        hooks.invoke(:encode_file)

        expect(subscriber).not_to have_received(:call)
      end

      it 'passes options to subscribers' do
        hooks = Hooks.new
        subscriber = double('subscriber', call: true)
        hooks.on(:encode_file, subscriber)

        hooks.invoke(:encode_file, {some: 'payload'})

        expect(subscriber).to have_received(:call).with({some: 'payload'})
      end

      it 'works without subscribers' do
        hooks = Hooks.new

        expect {
          hooks.invoke(:encode_file)
        }.not_to raise_error
      end
    end
  end
end
