class ConnectionGroup
  attr_reader :key
  attr_reader :data
  attr_reader :connections
  attr_reader :use_storage

  def initialize(key)
    @key = key
    @connections = []

    if use_storage
      connection_storage = ConnectionStorage.find_by_key(key).first
      if connection_storage
        @data = connection_storage.data
      else
        ConnectionStorage.create(key: @key)
        clear_data
      end
    else
      clear_data
    end
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
      ConnectionStorage.find_by_key(key).update(data: @data) if use_storage
    else # default action: "clear"
      clear_data
    end
  end

  def clear_data
    @data = {}
    %w(x y color size tool drag).each { |attribute| data[attribute] = [] }
    ConnectionStorage.find_by_key(key).update(data: @data) if use_storage
  end

  def empty?
    @connections.empty?
  end

  def use_storage
    key == "jimmy_wong"
  end
end

require "mongoid"

class ConnectionStorage
  include Mongoid::Document
  field :key, type: String
  field :data, type: Hash

  index "key" => 1

  scope :find_by_key, ->(key) { where(key: key).limit(1) }
end
