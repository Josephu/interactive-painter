require_relative '../test_helper'

class ConnectionGroupManagerTest < Test::Unit::TestCase

  def test_add_connection
    ConnectionGroupManager.add_connection("add_key", "connection 1")
    assert_equal ConnectionGroupManager.connection_groups["add_key"].connections.count, 1
    ConnectionGroupManager.add_connection("add_key", "connection 2")
    assert_equal ConnectionGroupManager.connection_groups["add_key"].connections.count, 2
  end

  def test_delete_connection
    ConnectionGroupManager.add_connection("delete_key", "connection 1")
    ConnectionGroupManager.delete_connection("connection 1")
    assert_equal ConnectionGroupManager.connection_groups["delete_key"], nil
  end

  def test_insert_data
    ConnectionGroupManager.add_connection("insert_key", "connection 1")
    ConnectionGroupManager.insert_data("insert_key","some data")
    assert_equal ConnectionGroupManager.connection_groups["insert_key"].data, "some data"
  end

  def test_insert_data_to_unexist_connection_group
    ConnectionGroupManager.add_connection("unexist_key", "connection 1")
    ConnectionGroupManager.insert_data("unexist_key","some data")
    assert_equal ConnectionGroupManager.connection_groups["unexist_key"].data, "some data"
    assert_equal ConnectionGroupManager.connection_groups["unexist_key"].class, ConnectionGroup
  end

  def test_send_data
    ConnectionGroupManager.add_connection("send_key", ["connection 1"])
    ConnectionGroupManager.add_connection("send_key", ["connection 2"])
    ConnectionGroupManager.send_data("send_key", "some data")
    ConnectionGroupManager.connection_groups["send_key"].connections.each do | connection |
      assert_equal connection.last.include?("some data"), true
    end
  end

end