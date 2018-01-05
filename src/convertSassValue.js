const sass = require('node-sass')



// Standardise boolean
function convertBooleanValue (v) {
	return v.getValue()
}

// Standardise number
function convertNumberValue (v) {
	return v.getValue()
}

// Standardise string
function convertStringValue (v) {
	return v.getValue()
}

// Standardise color value: always return rgba or rgb string
function convertColorValue (v) {

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

// Standardise list value
function convertListValue (v) {
	const list = []
	for (let i = 0; i < v.getLength(); i += 1) {
		list.push(convertSassValue(v.getValue(i)))
	}
	return list
}

// Standardise map value
function convertMapValue (v) {
	const map = {}
	for (let i = 0; i < v.getLength(); i += 1) {
		const key = convertSassValue(v.getKey(i))
		const value = convertSassValue(v.getValue(i))
		map[key] = value
	}
	return map
}



function convertSassValue (v) {

	if (v instanceof sass.types.Boolean) {
		return convertBooleanValue(v)
	}

	if (v instanceof sass.types.Color) {
		return convertColorValue(v)
	}

	if (v instanceof sass.types.List) {
		return convertListValue(v)
	}

	if (v instanceof sass.types.Map) {
		return convertMapValue(v)
	}

	if (v instanceof sass.types.Number) {
		return convertNumberValue(v)
	}

	if (v === sass.types.Null.NULL) {
		return null
	}

	if (v instanceof sass.types.String) {
		return convertStringValue(v)
	}

	return undefined
}



module.exports = convertSassValue
