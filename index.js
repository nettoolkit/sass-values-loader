const camelCase = require('lodash.camelcase')
const fromPairs = require('lodash.frompairs')
const loaderUtils = require('loader-utils')

const SassVariablesExtract = require('./extract.js')

module.exports = function (content) {
	const self = this
	const opts = loaderUtils.getOptions(self) || {}
	const callback = this.async()
	const version = this.version || 1
	const resourcePath = this.resourcePath
	const resolve = this.resolve.bind(this)

	this.cacheable && this.cacheable()

	const convertVariables = (variables) => {

		if (opts.preserveVariableNames) {
			return variables
		}

		return variables.map(([k, v]) => {
			return [camelCase(k), v]
		})
	}

	try {

		SassVariablesExtract(resourcePath, resolve, content).then((result) => {
			const dependencies = result.dependencies
			const variables = convertVariables(result.variables)

			// fromPairs will also eliminate duplicates for us
			const defaultExport = JSON.stringify(fromPairs(variables))
				.replace(/\u2028/g, '\\u2028')
				.replace(/\u2029/g, '\\u2029')

			// Create Module code
			let module = ''

			// Webpack 2+
			if (version >= 2) {

				// use Map to eliminate duplicates
				new Map(variables).forEach((value, name) => {
					const constExport = JSON.stringify(value)
						.replace(/\u2028/g, '\\u2028')
						.replace(/\u2029/g, '\\u2029')
					module += `export var ${name} = ${constExport}\n`
				})

				module += `export default ${defaultExport}\n`

			// Webpack 1
			} else {
				module = `module.exports = ${defaultExport}\n`
			}

			// Register dependencies dynamically
			dependencies.forEach((dependency) => {
				self.addDependency(dependency)
			})

			callback(null, module)
		}).catch((error) => {
			callback(error)
		})

	} catch (error) {
		callback(error)
	}
}
