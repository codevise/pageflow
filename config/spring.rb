require File.expand_path('../lib/pageflow/rails_version', File.dirname(__FILE__))
Spring.application_root = File.join(__FILE__,
                                    "../../spec/dummy/rails-#{Pageflow::RailsVersion.detect}")
