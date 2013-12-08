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

  def test_insert_data
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
      "x" => ["x","y", "z"], "y" => ["y","z","a"],
      "color" => ["c","d","e"], "size" => ["s","t","u"],
      "tool" => ["t","u","v"], "drag" => ["e","e","f"] 
    }
    data_result2 = {
      "x" => ["x","y", "z", "z"], "y" => ["y","z","a","a"],
      "color" => ["c","d","e","e"], "size" => ["s","t","u","u"],
      "tool" => ["t","u","v","v"], "drag" => ["e","e","f","f"] 
    }
    group = ConnectionGroup.new("some_key")
    group.insert_data(data1)
    assert_equal group.data, data1
    group.insert_data(data2)
    assert_equal group.data, data_result1
    group.insert_data(data2)
    assert_equal group.data, data_result2
  end
end