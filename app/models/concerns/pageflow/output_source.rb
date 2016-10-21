module Pageflow
  module OutputSource
    STATE_MAPPING = {
      true => 'finished',
      false => 'skipped'
    }.freeze

    extend ActiveSupport::Concern

    included do
      serialize :output_presences, JSON
    end

    def present_outputs
      present_outputs_label_state_array = output_presences.select do |output_label, _output_state|
        output_present?(output_label) == true
      end

      present_outputs_label_state_array.map { |output_label_state| output_label_state[0].to_sym }
    end

    def output_present?(type)
      output_presences[type.to_s]
    end

    def output_presences=(presences)
      boolean_presences = presences.stringify_keys.each_with_object({}) do |(key, value), result|
        if value == true || value == STATE_MAPPING[true]
          result[key] = true
        elsif value == false || value == STATE_MAPPING[false]
          result[key] = false
        elsif value.blank?
          result[key] = nil
        end
      end

      self[:output_presences] = output_presences
                                .merge(boolean_presences)
                                .reject { |_key, value| value.nil? }
    end

    def output_presences
      super || {}
    end
  end
end
