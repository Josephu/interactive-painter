namespace :assets do
  desc "Precompile assets"
  task :precompile do
    ENV["RACK_ENV"] = "production"
    Rake::Task["clobber_assets"].invoke
    Rake::Task["assets"].invoke
    fonts_dir = "#{Rake.application.original_dir}/asset/fonts/*"
    output_dir = "#{Rake.application.original_dir}/public/asset/fonts/"
    FileUtils.mkdir_p(output_dir)
    Dir[fonts_dir].each do |src|
      dst = output_dir+src.split('/').last
      FileUtils.cp(src, dst)
      puts "Writing #{dst}"
    end
  end
end