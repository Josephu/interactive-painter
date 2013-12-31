require 'faraday'

conn = Faraday.new(:url => 'http://localhost:4567') do |faraday|
  faraday.request  :url_encoded             # form-encode POST params
  faraday.response :logger                  # log requests to STDOUT
  faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
end

response = conn.post '/clear/1qaz2wsx3e'