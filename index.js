const camelCase = require('lodash').camelCase
const fromPairs = require('lodash').fromPairs
const loaderUtils = require('loader-utils')

const generateModuleExportValues = require('./src/generateModuleExportValues')
const extractSassVariables = require('./src/extract.js')

module.exports = function (content) {
	const self = this
	const opts = loaderUtils.getOptions(self) || {}
	const callback = this.async()
	const version = this.version || 1
	const resourcePath = this.resourcePath
	const resolve = this.resolve.bind(this)

	this.cacheable && this.cacheable()

	const convertVariables = (variables) => {

		if (opts.preserveKeys) {
			return variables
		}

		return variables.map(([k, v]) => {
			return [camelCase(k), v]
		})
	}

	try {

		extractSassVariables(resourcePath, resolve, content).then((result) => {
			const dependencies = result.dependencies
			const variables = convertVariables(result.variables)

			// fromPairs will also eliminate duplicates for us
			const defaultExport = generateModuleExportValues(fromPairs(variables))

			// Create Module code
			let module = ''

			// Webpack 2+
			if (version >= 2) {

				// use Map to eliminate duplicates
				new Map(variables).forEach((value, name) => {
					const constExport = generateModuleExportValues(value)

					// Force camelCase for module names
					module += `export var ${camelCase(name)} = ${constExport}\n`
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
