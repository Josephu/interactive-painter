require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << "test"
  t.test_files = FileList['test/controller/*test.rb', 'test/unit/*test.rb']
  t.verbose = true
end

desc "Run all tests"
namespace :test do
  task :full do
    Rake::Task["test"].invoke
    Rake::Task["jasmine:ci"].invoke
    Rake::Task["spec"].invoke
  end
end