class ConnectionGroup
  attr_reader :key
  attr_reader :data
  attr_reader :connections

  def initialize(key)
    @key = key
    @connections = []
    initialize_data
  end

  def add(connection)
    @connections << connection
  end

  def delete(connection)
    @connections.delete(connection)
  end

  def update_data(action, new_data)
    if action == "merge"
      queue_index = data["x"].length
      data["x"].length.times.each do |i|
        if data["x"][i] != new_data["x"][i] && data["y"][i] != new_data["y"][i] && data["drag"][i] != new_data["drag"][i]
          queue_index = i
          break
        end
      end
      %w(x y color size tool drag).each { |attribute| data[attribute] += new_data[attribute][queue_index..-1] }
    else # default action: "clear"
      initialize_data
    end
  end

  def empty?
    @connections.empty?
  end

  def initialize_data
    @data = {}
    %w(x y color size tool drag).each { |attribute| data[attribute] = [] }
  end
end