require 'spec_helper'

describe "Interactive mode:" do
  let(:browser) {page.driver.browser}
  before :each do
    visit "/interactive/#{rand(36**10).to_s(36)}"
    browser.manage.window.resize_to(1024,768)
    @tab = browser.window_handle
    page.find("#test_interactive").click
    @new_tab = browser.window_handles.last
  end

  it "draw lines" do
    page.find("canvas").draw_line(30, 30, 30, 60)
    page.find("canvas").draw_line(30, 60, 60, 60)
    page.find("canvas").draw_line(60, 60, 60, 30)
    page.find("canvas").draw_line(60, 30, 30, 30)

    page.find("canvas").draw_line(90, 30, 75, 60)
    page.find("canvas").draw_line(75, 60, 105, 60)
    page.find("canvas").draw_line(105, 60, 90, 30)

    # FF default behaviour open new window will not switch to it,
    # therefore need to switch to new tab to verify
    browser.switch_to.window(@new_tab)
    expect_image_match("draw_lines_interactive")
  end

  it "draw dots" do
    page.find("canvas").draw_line(100, 100, 100, 100)
    page.find("canvas").draw_line(200, 100, 200, 100)
    page.find("canvas").draw_line(150, 150, 140, 170)
    page.find("canvas").draw_line(100, 200, 200, 200)

    browser.switch_to.window(@new_tab)
    expect_image_match("draw_dots_interactive")
  end

  it "multiple colors" do
    ["purple", "green", "blue", "yellow", "brown", "orange","gray", "black"].each_with_index do |color, i|
      page.find(".color[value='#{color}']").click
      page.find("canvas").draw_line(30*i+15, 10, 30*i+15, 20)
    end

    browser.switch_to.window(@new_tab)
    expect_image_match("multiple_colors_interactive")
  end

  it "clear canvas" do
    page.find("canvas").draw_line(100, 100, 100, 100)
    page.find("canvas").draw_line(200, 100, 200, 100)
    page.find("#clear_canvas").click

    browser.switch_to.window(@new_tab)
    expect_image_match("clear_canvas_interactive")
  end

  it "erase canvas" do
    page.find("canvas").draw_line(30, 30, 30, 90)
    page.find("canvas").draw_line(30, 90, 90, 90)
    page.find("canvas").draw_line(90, 90, 90, 30)
    page.find("canvas").draw_line(90, 30, 30, 30)

    page.find(".fa-eraser").click
    page.find("canvas").draw_line(40, 40, 40, 80)

    browser.switch_to.window(@new_tab)
    expect_image_match("erase_canvas_interactive")
  end

  it "change size" do
    %w(2 4 6 8).each_with_index do |size, i|
      page.find(".size[value='#{size}']").click
      page.find("canvas").draw_line(30*i+15, 10, 30*i+15, 20)
    end

    browser.switch_to.window(@new_tab)
    expect_image_match("change_size_interactive")
  end
end