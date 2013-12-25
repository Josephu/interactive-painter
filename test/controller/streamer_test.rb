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
    assert last_response.body.include?("interactive") == true
  end

  def test_connect
    get '/connect/asecretkey'
    assert last_response.ok?
    assert last_response.header["Content-Type"] == "text/event-stream;charset=utf-8"
  end

  def test_push
    ConnectionGroupManager.stubs(:send_data)

    post '/push/asecretkey', data: {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }
    assert last_response.ok?
    assert last_response.body.empty? == true
  end

  def test_clear
    ConnectionGroupManager.stubs(:send_data)

    post '/clear/asecretkey'
    assert last_response.ok?
    assert last_response.body.empty? == true
  end
end