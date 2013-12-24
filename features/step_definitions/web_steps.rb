Given(/^I am on the home page$/) do
  visit '/'
end

Then(/^I should see "(.*)"$/) do |text|
  page.should have_content text
end