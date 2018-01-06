const isArray = require('lodash.isarray')
const sass = require('node-sass')
const convertSassValue = require('../src/convertSassValue')

describe('number', () => {

	test('becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10)
		)).toBe(10)
	})

	test('int becomes int', () => {
		expect(convertSassValue(
			new sass.types.Number(1)
		)).toBe(1)
	})

	test('float becomes float', () => {
		expect(convertSassValue(
			new sass.types.Number(0.5)
		)).toBe(0.5)
	})

})

describe('unit', () => {

	test('px becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'px')
		)).toBe(10)
	})

	test('pt becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'pt')
		)).toBe(10)
	})

	test('pc becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'pc')
		)).toBe(10)
	})

	test('em becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'em')
		)).toBe(10)
	})

	test('rem becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'rem')
		)).toBe(10)
	})

	test('% becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, '%')
		)).toBe(10)
	})

	test('cm becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'cm')
		)).toBe(10)
	})

	test('deg becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'deg')
		)).toBe(10)
	})

	test('rad becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'rad')
		)).toBe(10)
	})

	test('dpi becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'dpi')
		)).toBe(10)
	})

})



describe('time', () => {

	test('ms becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'ms')
		)).toBe(10)
	})

	test('s becomes number', () => {
		expect(typeof convertSassValue(
			new sass.types.Number(1, 's')
		)).toBe('number')
	})

	test('s becomes seconds', () => {
		expect(convertSassValue(
			new sass.types.Number(1, 's')
		)).toBe(1000)
	})

})


describe('string', () => {

	test('becomes string', () => {
		expect(convertSassValue(
			new sass.types.String('foo')
		)).toBe('foo')
	})

})



describe('color', () => {

	test('becomes array', () => {
		expect(isArray(convertSassValue(
			new sass.types.Color(0, 0, 0, 1)
		))).toBe(true)
	})

	test('returns alpha when included', () => {
		expect(convertSassValue(
			new sass.types.Color(0, 0, 0, 1)
		)[3]).toBe(1)
	})

	test('returns alpha when not included', () => {
		expect(convertSassValue(
			new sass.types.Color(0, 0, 0)
		).length).toBe(4)
	})

})



describe('singleton', () => {

	test('null becomes null', () => {
		expect(convertSassValue(
			sass.types.Null.NULL
		)).toBe(null)
	})

	test('true becomes true', () => {
		expect(convertSassValue(
			sass.types.Boolean.TRUE
		)).toBe(true)
	})

	test('false becomes false', () => {
		expect(convertSassValue(
			sass.types.Boolean.FALSE
		)).toBe(false)
	})

})



describe('list', () => {

	test('becomes empty array', () => {
		const list = new sass.types.List()
		expect(convertSassValue(list)).toEqual([])
	})

	test('becomes array with values', () => {
		let list = new sass.types.List(3)

		list.setValue(0, sass.types.Boolean.TRUE)
		list.setValue(1, new sass.types.String('foo'))
		list.setValue(2, new sass.types.Number(10))

		expect(convertSassValue(list)).toEqual([
			true,
			'foo',
			10
		])
	})

})



describe('map', () => {

	test('becomes empty object', () => {
		const list = new sass.types.Map()
		expect(convertSassValue(list)).toEqual({})
	})

	test('becomes object with key-value pairs', () => {
		let map = new sass.types.Map(3)

		map.setKey(0, new sass.types.String('one'))
		map.setKey(1, new sass.types.String('two'))
		map.setKey(2, new sass.types.String('three'))

		map.setValue(0, sass.types.Boolean.TRUE)
		map.setValue(1, new sass.types.String('foo'))
		map.setValue(2, new sass.types.Number(10))

		expect(convertSassValue(map)).toEqual({
			one: true,
			two: 'foo',
			three: 10
		})
	})

})
