require_relative '../test_helper'

class ConnectionGroupTest < Test::Unit::TestCase
  def test_empty?
    group = ConnectionGroup.new("some_key")
    assert_equal group.empty?, true
  end

  def test_add_connection
    group = ConnectionGroup.new("some_key")
    group.add("a fake connection")
    assert_equal group.connections.count, 1
    assert_equal group.connections.first, "a fake connection"
  end

  def test_delete_connection
    group = ConnectionGroup.new("some_key")
    group.add("a fake connection")
    group.delete("a fake connection")
    assert_equal group.connections.count, 0
  end

  def test_delete_unexist_connection
    group = ConnectionGroup.new("some_key")
    group.add("a fake connection")
    group.delete("an unexist connection")
    assert_equal group.connections.count, 1
    assert_equal group.connections.first, "a fake connection"
  end

  def test_delete_connectoin_in_empty_connection_group
    group = ConnectionGroup.new("some_key")
    group.delete("an unexist connection")
    assert_equal group.connections.count, 0
  end

  def test_update_data_using_merge
    data1 = {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }
    data2 = {
      "x" => ["x","z"], "y" => ["y","a"],
      "color" => ["c","e"], "size" => ["s","u"],
      "tool" => ["t","v"], "drag" => ["e","f"]
      }
    data_result1 = {
      "x" => [["x","y"]],
      "y" => [["y","z"]],
      "color" => [["c","d"]],
      "size" => [["s","t"]],
      "tool" => [["t","u"]],
      "drag" => [["e","e"]]
      }
    data_result2 = {
      "x" => [["x","y"], ["x", "z"]],
      "y" => [["y","z"], ["y","a"]],
      "color" => [["c","d"],["c","e"]],
      "size" => [["s","t"],["s","u"]],
      "tool" => [["t","u"],["t", "v"]],
      "drag" => [["e","e"],["e", "f"]]
    }
    group = ConnectionGroup.new("some_key")
    group.update_data("merge", data1)
    assert_equal group.data, data_result1
    group.update_data("merge", data2)
    assert_equal group.data, data_result2
  end

  def test_update_data_using_clear
    data_result = {
      "x" => [], "y" => [],
      "color" => [], "size" => [],
      "tool" => [], "drag" => []
      }
    group = ConnectionGroup.new("some_key")
    group.update_data( {}, "clear")
    assert_equal group.data, data_result
  end

  def test_new_storage
    Mongoid.purge!
    ConnectionStorage.expects(:create).times(1)
    ConnectionGroup.new("jimmy_wong")
  end

  def test_update_storage_using_merge
    Mongoid.purge!
    data1 = {
      "x" => ["x","y"], "y" => ["y","z"],
      "color" => ["c","d"], "size" => ["s","t"],
      "tool" => ["t","u"], "drag" => ["e","e"]
      }
    data_result1 = {
      "x" => [["x","y"]],
      "y" => [["y","z"]],
      "color" => [["c","d"]],
      "size" => [["s","t"]],
      "tool" => [["t","u"]],
      "drag" => [["e","e"]]
      }
    group = ConnectionGroup.new("jimmy_wong")
    group.update_data("merge", data1)
    assert_equal ConnectionStorage.find_by_key("jimmy_wong").first.data, data_result1
  end

  def test_update_storage_using_clear
    Mongoid.purge!
    data_result = {
      "x" => [], "y" => [],
      "color" => [], "size" => [],
      "tool" => [], "drag" => []
      }
    group = ConnectionGroup.new("jimmy_wong")
    group.update_data( {}, "clear")
    assert_equal ConnectionStorage.find_by_key("jimmy_wong").first.data, data_result
  end
end