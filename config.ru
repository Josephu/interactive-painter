require "./script/compile_asset" if ENV["RACK_ENV"] != "production"
require "./streamer"

map '/' do
  run Streamer.new
end