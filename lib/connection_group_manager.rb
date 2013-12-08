require "#{File.dirname(__FILE__)}/connection_group"

class ConnectionGroupManager
  @@connection_groups = {}
  @@add_connection_semaphore = Mutex.new
  @@delete_connection_semaphore = Mutex.new
  @@insert_data_semaphore = Mutex.new

  # Given a new connection is create
  # When a connection group with "A" key does not exist, then create a connection group
  # When a connection group with "A" key exists, then add connection to this group
  def self.add_connection(key, connection)
    @@add_connection_semaphore.synchronize {
      @@connection_groups[ key ] = ConnectionGroup.new(key) unless @@connection_groups[ key ]
      @@connection_groups[ key ].add(connection)
    }
    puts "[Add][#{key}] connections: #{@@connection_groups[ key ].connections.count.to_s}\n"
  end

  # Given a connection is to be deleted
  # When the connection group which this connection belongs to is empty, then remove this group
  def self.delete_connection(connection)
    @@delete_connection_semaphore.synchronize {
      @@connection_groups.each do | key, connection_group |
        puts "[Delete][#{key}] connections: #{connection_group.connections.count.to_s}\n" if connection_group.delete(connection)    
        @@connection_groups = @@connection_groups.tap {|c| c.delete(key)} if connection_group.empty?
      end
    }
  end

  # Given server send data to connections
  # Insert data to connection group and send data to all connections
  def self.send_data(key, data)
    insert_data(key, data)
    @@connection_groups[ key ].connections.each { |connection| connection << "data: #{data.to_json}\n\n" }
  end

  # Given server receive data from connection
  # When connection group with "A" key exists, insert data to this group
  # When connection group with "A" key does not exist, create this group and insert data to this group 
  def self.insert_data(key, data)
    @@insert_data_semaphore.synchronize {
      @@connection_groups[ key ] = ConnectionGroup.new(key) unless @@connection_groups[ key ]
      @@connection_groups[ key ].insert_data(data)
    }
  end

  def self.get_data(key)
    @@connection_groups[ key ].data if @@connection_groups[key]
  end

  def self.connection_groups
    @@connection_groups
  end
end