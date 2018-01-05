const generateModuleExportValues = require('../src/generateModuleExportValues')

describe('singletons', () => {

	test('int', () => {
		expect(generateModuleExportValues(100)).toBe('100')
	})

	test('array', () => {
		expect(generateModuleExportValues([])).toBe('[]')
	})

})

describe('object', () => {

	test('empty', () => {
		expect(generateModuleExportValues({})).toBe('{}')
	})

	test('with one value', () => {
		expect(generateModuleExportValues({
			foo: 'bar'
		})).toBe('{"foo":"bar"}')
	})

	test('with multiple values', () => {
		expect(generateModuleExportValues({
			foo: 'bar',
			bar: 123
		})).toBe('{"foo":"bar","bar":123}')
	})

	test('with nested objects', () => {
		expect(generateModuleExportValues({
			foo: {
				foo: {
					foo: 123
				}
			}
		})).toBe('{"foo":{"foo":{"foo":123}}}')
	})

})
