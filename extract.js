const async = require('async')
const path = require('path')
const fs = require('fs-extra')
const utils = require('loader-utils')
const isArray = require('lodash.isarray')
const sass = require('node-sass')
const createQueryWrapper = require('query-ast')
const scssParser = require('scss-parser')

// This queue makes sure node-sass leaves one thread available for executing
// fs tasks when running the custom importer code.
// This can be removed as soon as node-sass implements a fix for this.
const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4
const asyncSassJobQueue = async.queue(sass.render.bind(sass), threadPoolSize - 1)

function cleanAST (ast) {
	if (isArray(ast)) {
		return ast.map(cleanAST)
	}
	return {
		type: ast.type,
		value: ast.value
	}
}

function transformSASSFile (data) {
	const ast = scssParser.parse(data)
	const $ = createQueryWrapper(ast)

	$().children('declaration')
		.replace((declaration) => {
			const $declaration = $(declaration)
			const $property = $declaration.children('property').first()
			const $variable = $property.children('variable').first()
			const variableName = $variable.value()

			const $value = $declaration.children('value').first()
			const $nonSpace = $value.children(/^(?:(?!space).)*$/)
			const $bang = $value.children('operator').filter((op) => {
				return $(op).value() === '!'
			})

			// index of $bang *within* $nonSpace
			const bangIndex = $bang.length() && $nonSpace.index($bang.nodes[0])

			// index of the first non-space item relative to siblings
			const $first = $nonSpace.first()
			const firstIndex = $first.index()
			// index of the last non-space item relative to siblings
			const lastIndex = (bangIndex ? $nonSpace.eq(bangIndex - 1) : $nonSpace.last()).index()

			const $rm = $value.children().filter((n) => {
				const idx = $(n).index()
				return idx > firstIndex && idx <= lastIndex
			}).remove()

			$first.replace(() => {
				const $args = $first.concat($rm)

				const args = []
				args.push({ type: 'string_double', value: variableName })
				args.push({ type: 'punctuation', value: ',' })
				args.push({ type: 'space', value: ' ' })

				Array.prototype.push.apply(args, cleanAST($args.get()))

				return {
					type: 'function',
					value: [
						{ type: 'identifier', value: 'export_var' },
						{ type: 'arguments', value: args }
					]
				}
			})

			return declaration
		})

	return scssParser.stringify($().get(0))
}

function convertSASSValue (v) {
	if (v instanceof sass.types.Boolean) {
		return v.getValue()
	}

	if (v instanceof sass.types.Color) {

		// Round color values
		const r = Math.round(v.getR())
		const g = Math.round(v.getG())
		const b = Math.round(v.getB())

		// Won't round alpha
		const a = v.getA()

		// Solid color
		if (a === 1) {
			return 'rgb(' + r + ', ' + g + ', ' + b + ')'
		}

		// Color with alpha
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
	}

	if (v instanceof sass.types.List) {
		const list = []
		for (let i = 0; i < v.getLength(); i += 1) {
			list.push(convertSASSValue(v.getValue(i)))
		}
		return list
	}

	if (v instanceof sass.types.Map) {
		const map = {}
		for (let i = 0; i < v.getLength(); i += 1) {
			const key = convertSASSValue(v.getKey(i))
			const value = convertSASSValue(v.getValue(i))
			map[key] = value
		}
		return map
	}

	if (v instanceof sass.types.Number) {
		return v.getValue()
	}

	// use Singleton instance
	if (v === sass.types.Null.NULL) {
		return null
	}

	if (v instanceof sass.types.String) {
		return v.getValue()
	}

	return undefined
}

function exportSASSValue (vars, name, value) {
	const n = convertSASSValue(name)
	const v = convertSASSValue(value)
	if (n !== undefined || v !== undefined) {
		vars.push([n, v])
	}
	return value
}

function createImporter (resourcePath, resolve, deps) {
	return (url, prev, done) => {
		const dir = path.dirname(prev === 'stdin' ? resourcePath : prev)
		resolve(dir, utils.urlToRequest(url), (err, file) => {
			if (err) throw err
			deps.push(file)
			fs.readFile(file, 'utf8', (e, data) => {
				if (e) throw e
				done({ contents: transformSASSFile(data) })
			})
		})
	}
}

function parseSASS (data, importer, functions) {
	return new Promise((resolve, reject) => {
		asyncSassJobQueue.push({
			data,
			importer,
			functions
		}, (err, result) => {
			if (err) {
				reject(err); return
			}
			resolve()
		})
	})
}

function SassVariablesExtract (resourcePath, resolve, sassData) {
	const variables = []
	const dependencies = []

	try {
		const transformedSass = transformSASSFile(sassData)

		const importer = createImporter(resourcePath, resolve, dependencies)

		const exportVar = (name, value) => {
			return exportSASSValue(variables, name, value)
		}

		const functions = {
			export_var: exportVar
		}

		return parseSASS(transformedSass, importer, functions).then(() => {
			return {
				variables,
				dependencies
			}
		})

	} catch (e) {
		return Promise.reject(e)
	}
}

module.exports = SassVariablesExtract
