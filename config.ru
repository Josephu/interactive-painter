require "./streamer"

if ENV["RACK_ENV"] != "test"
  map "/application.manifest" do
    offline = Rack::Offline.new :cache => false, :root => Streamer.public_folder do
      Dir[File.join(Streamer.public_folder, "**/*")].each do |file|
        if %(png ico eot svg tff woff otf).include? file.split(".")[-1]
          cache file.sub(File.join(Streamer.public_folder, ""), "")
        end
      end
      cache Streamer.javascript_tag
      cache Streamer.stylesheet_tag
      network "/"
    end

    run offline
  end
end

if ENV["RACK_ENV"] != "production"
  map '/asset' do
    run Streamer.asset
  end
end

map "/" do
  run Streamer.new
end