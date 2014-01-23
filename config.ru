require "./script/compile_asset" if ENV["RACK_ENV"] != "production"
require "./streamer"

map "/application.manifest" do
  offline = Rack::Offline.new :cache => false, :root => Streamer.public_folder do
    #cache "http://fonts.googleapis.com/css?family=Bree+Serif"
    #cache "http://themes.googleusercontent.com/static/fonts/breeserif/v2/LQ7WLTaITDg4OSRuOZCps73hpw3pgy2gAi-Ip7WPMi0.woff"
    Dir[File.join(Streamer.public_folder, "**/*")].each do |file|
      if %(png ico eot svg tff woff otf js css).include? file.split(".")[-1]
        cache file.sub(File.join(Streamer.public_folder, ""), "")
      end
    end
    network "/"
  end

  run offline
end

map "/" do
  run Streamer.new
end