# Change to use your favorite method of configuration. Consider the
# dotenv gem to setup your environment with a .env file.

Resque.redis = ENV.fetch('REDIS_URL', 'localhost:6379')
