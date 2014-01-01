({
  baseUrl: "../../asset/js",
  paths: {
    requireLib: "lib/require",
    line_manager: "app/line_manager",
    canvas: "app/canvas",
    file: "app/file",
    modernizr: "lib/modernizr-2.6.2.min",
    jquery: "lib/jquery-1.10.1.min",
    underscore: "lib/underscore-min",
    mobile: "app/mobile"
  },
  name: "main",
  out: "../../public/js/application.js",
  include: ["requireLib"]
})
