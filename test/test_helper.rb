ENV["RAILS_ENV"] = "test"

require 'bundler'

Bundler.require :default, :test

require 'test/unit'
require 'rack/test'

require_relative "../lib/connection_group_manager"
require_relative "../streamer.rb"