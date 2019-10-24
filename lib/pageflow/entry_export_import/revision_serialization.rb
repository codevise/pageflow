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
          storylines: {
            except: :revision_id,
            include: {
              chapters: {
                except: :storyline_id,
                include: {
                  pages: {
                    except: :chapter_id
                  }
                }
              }
            }
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
        end
      end
    end
  end
end
