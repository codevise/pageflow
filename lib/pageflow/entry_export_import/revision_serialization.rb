module Pageflow
  module EntryExportImport
    # Turn revision into JSON compatible data structure.
    module RevisionSerialization
      extend self

      SERIALIZE_OPTIONS = {
        except: [:entry_id, :creator_id],
        include: {
          widgets: {
            except: [:subject_id, :subject_type]
          },
          file_usages: {
            except: [:revision_id],
            include: {
              file: {
                except: [:entry_id, :job_id]
              }
            }
          }
        }
      }.freeze

      def dump(revision)
        revision
          .as_json(SERIALIZE_OPTIONS)
          .merge('components' => serialize_revision_components(revision))
      end

      def import(data, options)
        Import.new(options).perform(data)
      end

      private

      def serialize_revision_components(revision)
        revision.find_revision_components.map do |revision_component|
          revision_component
            .attributes.except('revision_id')
            .merge('class_name' => revision_component.class.name)
            .merge('components' => serialize_nested_revision_components(revision_component))
        end
      end

      def serialize_nested_revision_components(revision_component)
        collection_names = revision_component.nested_revision_component_collection_names

        collection_names.each_with_object({}) do |collection_name, result|
          collection = revision_component.send(collection_name)

          result[collection_name] = collection.map do |nested_component|
            nested_component
              .attributes
              .merge('components' => serialize_nested_revision_components(nested_component))
          end
        end
      end
    end
  end
end
