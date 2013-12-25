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

  def test_update_data
    data = {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }

    result = {
      "x" => [["x","y"]], "y" => [["y","z"]],
      "color" => [["c","d"]], "size" => [["s","t"]],
      "tool" => [["t","u"]], "drag" => [["e","e"]]
      }
    ConnectionGroupManager.add_connection("update_key", "connection 1")
    ConnectionGroupManager.update_data("update_key", "merge", data)
    assert_equal ConnectionGroupManager.connection_groups["update_key"].data, result
  end

  def test_update_data_to_unexist_connection_group
    data = {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }

    result = {
      "x" => [["x","y"]], "y" => [["y","z"]],
      "color" => [["c","d"]], "size" => [["s","t"]],
      "tool" => [["t","u"]], "drag" => [["e","e"]]
      }
    ConnectionGroupManager.add_connection("unexist_key", "connection 1")
    ConnectionGroupManager.update_data("unexist_key", "merge", data)
    assert_equal ConnectionGroupManager.connection_groups["unexist_key"].data, result
    assert_equal ConnectionGroupManager.connection_groups["unexist_key"].class, ConnectionGroup
  end

  def test_send_data
    data = {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }

    result = {
      "x" => [["x","y"]], "y" => [["y","z"]],
      "color" => [["c","d"]], "size" => [["s","t"]],
      "tool" => [["t","u"]], "drag" => [["e","e"]]
      }
    ConnectionGroupManager.add_connection("send_key", ["connection 1"])
    ConnectionGroupManager.add_connection("send_key", ["connection 2"])
    ConnectionGroupManager.send_data("send_key", "merge", data)
    ConnectionGroupManager.connection_groups["send_key"].connections.each do | connection |
      assert_equal connection.last.include?(result.to_json), true
    end
  end

end