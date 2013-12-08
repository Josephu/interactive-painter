class ConnectionGroup
  attr_reader :key
  attr_reader :data
  attr_reader :connections

  def initialize(key)
    @key = key
    @connections = []
    @data = nil
  end

  def add(connection)
    @connections << connection
  end

  def delete(connection)
    @connections.delete(connection)
  end

  def insert_data(new_data)
    if data
      queue_index = -1
      data["x"].length.times.each do |i|
        if data["x"][i] != new_data["x"][i]
          queue_index = i
          break
        end
      end
      %w(x y color size tool drag).each { |attribute| data[attribute] += new_data[attribute][queue_index..-1] }
    else
      @data = new_data
    end
  end

  def empty?
    @connections.empty?
  end
end