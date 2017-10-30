'use strict'

var fs = require('fs')
var crypto = require('crypto')
var globby = require('globby')

var configure = {
	entry: 'index.html',
	icon: 'logo.png',
}

function SolidificationWebpackPlugin (options) {
	configure = Object.assign({}, configure, options)
}

function checksum (pathname) {
	const content = fs.readFileSync(pathname)
	return crypto.createHmac('md5', content).digest('hex')
}

SolidificationWebpackPlugin.prototype.apply = function(compiler) {
	compiler.plugin('after-emit', function (compilation, callback) {
		var pkg = JSON.parse(fs.readFileSync(this.options.context + '/package.json'))

		var updates = {}
		updates.app = configure.app || pkg.name
		updates.name = configure.name || pkg.name
		updates.version = configure.version || pkg.version
		updates.entry = configure.entry
		updates.icon = configure.icon
		updates.resources = {}

		const outputPath = this.options.output.path.replace(/\\/g, '/') + '/'

		for (let filename of globby.sync(outputPath + '**/*')) {
			var ext = filename.split('.').pop()
			if (ext == 'map') {
				continue
			}
			var stat = fs.lstatSync(filename)
			if (!stat.isFile()) {
				continue
			}
			const file = filename.replace(outputPath, '')
			updates.resources[file] = {
				checksum: checksum(filename),
				size: stat.size,
				url: (configure.publicUrl || this.options.output.publicPath) + file
			}
		}
		var content = JSON.stringify(updates, null, 2)
		fs.writeFileSync(this.options.output.path + '/updates', content)

		callback()
	})
}

module.exports = SolidificationWebpackPlugin