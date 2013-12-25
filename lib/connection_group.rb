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

  def update_data(action, new_data = nil)
    if action == "merge"
      %w(x y color size tool drag).each { |attribute| data[attribute] << new_data[attribute] }
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