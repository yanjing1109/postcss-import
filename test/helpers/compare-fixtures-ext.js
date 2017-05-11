// builtin tooling
var fs = require("fs")

// external tooling
var assign = require("object-assign")
var postcss = require("postcss")

// plugin
var atImport = require("../..")

function read(name, ext) {
  if (!ext) ext = ".css"
  return fs.readFileSync("test/fixtures/" + name + ext, "utf8")
}

module.exports = function(t, name, ext, opts, postcssOpts, warnings) {
  opts = assign({ path: "test/fixtures/imports" }, opts)
  return postcss(atImport(opts))
    .process(read(name, ext), postcssOpts || {})
    .then(function(result) {
      var actual = result.css
      var expected = read(name + ".expected")
      // handy thing: checkout actual in the *.actual.css file
      fs.writeFile("test/fixtures/" + name + ".actual.css", actual)
      t.is(actual, expected)
      if (!warnings) {
        warnings = []
      }
      result.warnings().forEach(function(warning, index) {
        t.is(
          warning.text,
          warnings[index],
          "unexpected warning: \"" + warning.text + "\""
        )
      })
    })
}
