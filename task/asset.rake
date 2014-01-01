namespace :assets do
  desc "Precompile assets"
  task :precompile do
    ENV["RACK_ENV"] = "production"
    require_relative "../script/compile_asset"
  end
end