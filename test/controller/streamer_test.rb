require_relative '../test_helper'

class StreamerTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Streamer.new
  end

  def test_root
    get '/'
    assert last_response.ok?
    assert last_response.body.include? "<h1>Paint Ur Image</h1>"
    assert last_response.body.include? "interactive"
  end

  def test_interactive
    get '/interactive/asecretkey'
    assert last_response.ok?
    assert last_response.body.include? "<h1>Paint Ur Image</h1>"
    assert last_response.body.include?("interactive") ==  false   
  end

  def test_connect
    get '/connect/asecretkey'
    assert last_response.ok?
    assert last_response.header["Content-Type"] == "text/event-stream;charset=utf-8"
  end

  def test_push
    post '/push/asecretkey'
    assert last_response.ok?
    assert last_response.body.empty? == true
  end
end