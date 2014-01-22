require 'bundler'
Bundler.require :default

require "sinatra/reloader" if development?

require "#{File.dirname(__FILE__)}/lib/connection_group_manager"

Mongoid.load!("#{File.dirname(__FILE__)}/config/mongoid.yml")

Bundler.require :customize if !test?

Bundler.require :asset

class Streamer < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :public_folder, Proc.new { File.join(root, "public") }
  set :views, Proc.new { File.join(root, "views") }
  set :server, "thin"
  set :asset, Proc.new {
    Sprockets::Environment.new do |environment|
      environment.append_path 'asset'
      environment.append_path File.join(Gem.loaded_specs['compass'].full_gem_path, 'frameworks', 'compass','stylesheets')
    end
  }
  set :manifest, Proc.new { YAML.load(File.open("#{public_folder}/asset/manifest.yml")) }
  set :javascript_tag, Proc.new {"/asset/"+((ENV["RACK_ENV"] == "production") ? settings.manifest["assets"]["js/application.js"] : "js/application-#{settings.asset.find_asset("js/application.js").digest}.js")}
  set :stylesheet_tag, Proc.new {"/asset/"+((ENV["RACK_ENV"] == "production") ? settings.manifest["assets"]["stylesheet/application.css"] : "stylesheet/application-#{settings.asset.find_asset("stylesheet/application.css").digest}.css")}

  def timestamp
    Time.now.strftime("%H:%M:%S")
  end

  get '/' do
    random_key = rand(36**10).to_s(36)
    erb :index, locals: { random_key: random_key }
  end

  get '/interactive/:key' do
    erb :index, locals: { random_key: nil, current_key: (ENV["RACK_ENV"] != "production") ? params[:key] : nil }
  end

  get '/connect/:key', provides: 'text/event-stream' do
    stream :keep_open do |connection|
      ConnectionGroupManager.add_connection(params[:key], connection)

      logger.info "#connect: connection [ #{params[:key]} ]"

      connection.callback {
        logger.info "#delete: connection"
        ConnectionGroupManager.delete_connection(connection)
      }
    end
  end

  post '/push/:key' do
    logger.info "#push: connection [ #{params[:key]} ]"

    ConnectionGroupManager.send_data(params[:key], "merge", params[:data])
    status 200
  end

  post '/clear/:key' do
    logger.info "#push: connection [ #{params[:key]} ]"

    ConnectionGroupManager.send_data(params[:key], "clear")
    status 200
  end
end