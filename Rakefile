if ENV["RACK_ENV"] != "production"
  require 'rspec/core/rake_task'
  desc "Run all specs in spec directory"
  RSpec::Core::RakeTask.new do |t|
    t.rspec_opts = ["-r ./spec/spec_helper.rb"]
    t.pattern = './spec/**/*_spec.rb'
  end

  load 'task/test.rake'

  begin
    require 'jasmine'
    load 'jasmine/tasks/jasmine.rake'
  rescue LoadError
    task :jasmine do
      abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
    end
  end
end

load 'task/asset.rake'

require './streamer'
require 'rake/sprocketstask'
Rake::SprocketsTask.new do |t|
  t.environment = Streamer.asset
  t.output = File.join(Streamer.public_folder, "asset", "manifest.yml")
  t.assets = ["stylesheet/application.css", "js/application.js"]
  t.environment.css_compressor = Sprockets::SassCompressor
  t.environment.js_compressor = Sprockets::UglifierCompressor
end
