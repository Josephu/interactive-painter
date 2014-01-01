path = "#{File.dirname(__FILE__)}/asset"

compile_js_command = ["node", "#{path}/r.js", "-o", "#{path}/buildjs.js"]
compile_css_command = ["node", "#{path}/r.js", "-o", "#{path}/buildcss.js"]

if ENV["RACK_ENV"] == "production"
  compile_css_command << "optimizeCss=default"
else
  compile_js_command << "optimize=none"
end

system(compile_js_command.join(" "))
system(compile_css_command.join(" "))