#!/usr/bin/env rackup
#\ -E deployment

use Rack::ContentLength

#app = Rack::Directory.new Dir.pwd
#run app
@root = File.dirname(__FILE__)

run Proc.new { |env|
  # Extract the requested path from the request
  path = Rack::Utils.unescape(env['PATH_INFO'])
  index_file = @root + "#{path}/index.html"

  if File.exists?(index_file)
    [200, {'Content-Type' => 'text/html'}, [File.read(index_file)]]
  else
    Rack::Directory.new(@root).call(env)
  end
}
