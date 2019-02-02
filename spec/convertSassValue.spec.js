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
	const testColor = convertSassValue(new sass.types.Color(8, 16, 32))
	const testColorAlpha = convertSassValue(new sass.types.Color(8, 16, 32, 0.5))
	const testColorTransparent = convertSassValue(new sass.types.Color(8, 16, 32, 0))

	test('has r', () => {
		expect(testColor.r).toBe(8)
	})

	test('has g', () => {
		expect(testColor.g).toBe(16)
	})

	test('has b', () => {
		expect(testColor.b).toBe(32)
	})

	test('has a', () => {
		expect(testColor.a).toBe(1)
	})

	test('has solid a', () => {
		expect(testColor.a).toBe(1)
	})

	test('has float a', () => {
		expect(testColorAlpha.a).toBe(0.5)
	})

	test('has transparent a', () => {
		expect(testColorTransparent.a).toBe(0)
	})

	test('has rgba string', () => {
		expect(typeof testColor.rgba).toBe('string')
	})

	test('has correct rgba formatting when solid', () => {
		expect(testColor.rgba).toBe('rgba(8, 16, 32, 1)')
	})

	test('has correct rgba formatting when half transparent', () => {
		expect(testColorAlpha.rgba).toBe('rgba(8, 16, 32, 0.5)')
	})

	test('has correct rgba formatting when transparent', () => {
		expect(testColorTransparent.rgba).toBe('rgba(8, 16, 32, 0)')
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
