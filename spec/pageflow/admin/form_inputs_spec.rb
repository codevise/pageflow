require 'spec_helper'

module Pageflow
  module Admin
    describe FormInputs do
      describe '#build' do
        it 'calls input for registered form inputs' do
          form_inputs = FormInputs.new
          form_builder = double('form builder').as_null_object

          form_inputs.register(:entry, :title)
          form_inputs.register(:entry, :text, hint: 'text')
          form_inputs.build(:entry, form_builder)

          expect(form_builder).to have_received(:input).with(:title, {})
          expect(form_builder).to have_received(:input).with(:text, hint: 'text')
        end

        it 'only calls input for given resource' do
          form_inputs = FormInputs.new
          form_builder = double('form builder').as_null_object

          form_inputs.register(:entry, :title)
          form_inputs.build(:account, form_builder)

          expect(form_builder).not_to have_received(:input)
        end

        it 'supports options as lambda' do
          form_inputs = FormInputs.new
          form_builder = double('form builder').as_null_object

          form_inputs.register(:entry, :title, -> { {hint: 'localized hint'} })
          form_inputs.build(:entry, form_builder)

          expect(form_builder).to have_received(:input).with(:title, hint: 'localized hint')
        end
      end

      describe '#permitted_attributes_for' do
        it 'returns names of inputs for resource' do
          form_inputs = FormInputs.new

          form_inputs.register(:entry, :title)
          form_inputs.register(:entry, :text)
          form_inputs.register(:account, :name)
          result = form_inputs.permitted_attributes_for(:entry)

          expect(result).to eq([:title, :text])
        end
      end

      describe '#find_all_for' do
        it 'returns form inputs for resource' do
          form_inputs = FormInputs.new

          form_inputs.register(:entry, :title)
          form_inputs.register(:entry, :text)
          form_inputs.register(:account, :name)
          result = form_inputs.find_all_for(:entry)

          expect(result.map(&:attribute_name)).to eq([:title, :text])
        end
      end
    end
  end
end
