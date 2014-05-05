# Used by pageflow's own mailers to perform mail delivery inside
# resque jobs.

Resque::Mailer.excluded_environments = [:development, :test]
