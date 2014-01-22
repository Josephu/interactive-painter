ENV['RACK_ENV'] = 'test'

require 'rspec'
require 'rack/test'
require 'capybara'
require 'rmagick'
require_relative "../streamer.rb"

Capybara.default_driver = :selenium

Capybara.server do |app, port|
  require 'rack/handler/thin'
  Rack::Handler::Thin.run(app, :Port => port)
end

Capybara.app = eval "Rack::Builder.new {#{File.read('./config.ru')}}"

RSpec.configure do |conf|
  conf.include Rack::Test::Methods
  conf.include Capybara::DSL
end

Pry.config.editor = "vim"

# reference http://pastie.org/3570066#
Capybara::Node::Element.class_eval do
  def draw_line(x1, y1, x2, y2)
    right = x1 - (native.size.width / 2)
    top = y1 - (native.size.height / 2)
    move_right = x2 - x1
    move_top = y2 - y1
    driver.browser.action.move_to(native).move_by(right.to_i, top.to_i).click_and_hold.move_by(move_right.to_i, move_top.to_i).release.perform
  end
end

def expect_image_match(name)
  page.save_screenshot("spec/images/test/#{name}.png")
  img1 = Magick::Image.read("./spec/images/result/#{name}.png")
  img2 = Magick::Image.read("./spec/images/test/#{name}.png")
  diff_img, diff_metric = img1[0].compare_channel( img2[0], Magick::MeanSquaredErrorMetric )
  expect(diff_metric).to be < 0.000000000001
end

def save_image_match(name)
  page.save_screenshot("spec/images/result/#{name}.png")
end