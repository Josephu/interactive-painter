ENV['RACK_ENV'] = 'test'

require 'test/unit'
require 'rack/test'
require 'mocha/setup'

require_relative "../streamer.rb"