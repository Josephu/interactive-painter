require 'spec_helper'

describe "Single user mode:" do
  before(:each) do
    @browser = page.driver.browser
    @browser.manage.window.resize_to(1024,768)
    visit '/'
  end

  after(:each) do
    page.find("#clear_canvas").click
  end

  it "expect responsive showing title" do
    expect(page).to have_no_content('Paint Ur Image')

    @browser.manage.window.resize_to(1025,768)
    expect(page).to have_content('Paint Ur Image')
  end

  it "draw lines" do
    page.find("canvas").draw_line(30, 30, 30, 60)
    page.find("canvas").draw_line(30, 60, 60, 60)
    page.find("canvas").draw_line(60, 60, 60, 30)
    page.find("canvas").draw_line(60, 30, 30, 30)

    page.find("canvas").draw_line(90, 30, 75, 60)
    page.find("canvas").draw_line(75, 60, 105, 60)
    page.find("canvas").draw_line(105, 60, 90, 30)

    expect_image_match("draw_lines")
  end

  it "draw dots" do
    page.find("canvas").draw_line(100, 100, 100, 100)
    page.find("canvas").draw_line(200, 100, 200, 100)
    page.find("canvas").draw_line(150, 150, 140, 170)
    page.find("canvas").draw_line(100, 200, 200, 200)

    expect_image_match("draw_dots")
  end

  it "multiple colors" do
    ["purple", "green", "blue", "yellow", "brown", "orange","gray", "black"].each_with_index do |color, i|
      page.find(".color[value='#{color}']").click
      page.find("canvas").draw_line(30*i+15, 10, 30*i+15, 20)
    end

    expect_image_match("multiple_colors")
  end

  it "clear canvas" do
    page.find("canvas").draw_line(100, 100, 100, 100)
    page.find("canvas").draw_line(200, 100, 200, 100)
    page.find("#clear_canvas").click

    expect_image_match("clear_canvas")
  end

  it "erase canvas" do
    page.find("canvas").draw_line(30, 30, 30, 90)
    page.find("canvas").draw_line(30, 90, 90, 90)
    page.find("canvas").draw_line(90, 90, 90, 30)
    page.find("canvas").draw_line(90, 30, 30, 30)

    page.find(".fa-eraser").click
    page.find("canvas").draw_line(40, 40, 40, 80)

    expect_image_match("erase_canvas")
  end

  it "change size" do
    %w(2 4 6 8).each_with_index do |size, i|
      page.find(".size[value='#{size}']").click
      page.find("canvas").draw_line(30*i+15, 10, 30*i+15, 20)
    end

    expect_image_match("change_size")
  end

  it "switch to interactive mode" do
    page.find("#interactive").click

    expect(current_path).to match(/\/interactive\/.{10}/)
  end
end