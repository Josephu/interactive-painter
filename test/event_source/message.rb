require "em-eventsource"

EM.run do
  source = EventMachine::EventSource.new("http://localhost:4567/connect/1qaz2wsx3e")
  source.message do |message|
    puts "new message #{message}"
  end
  source.start
end