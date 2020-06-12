// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Copied from ApplicationInsights-JS and slightly modified, so
// it should work. No need to refactor to make linter happy
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */

export class DataSanitizer {
	/**
	 * Max length allowed for custom names.
	 */
	public static MAX_NAME_LENGTH = 150

	/**
	 * Max length allowed for Id field in page views.
	 */
	public static MAX_ID_LENGTH = 128

	/**
	 * Max length allowed for custom values.
	 */
	public static MAX_PROPERTY_LENGTH = 8192

	/**
	 * Max length allowed for names
	 */
	public static MAX_STRING_LENGTH = 1024

	/**
	 * Max length allowed for url.
	 */
	public static MAX_URL_LENGTH = 2048

	/**
	 * Max length allowed for messages.
	 */
	public static MAX_MESSAGE_LENGTH = 32768

	/**
	 * Max length allowed for exceptions.
	 */
	public static MAX_EXCEPTION_LENGTH = 32768

	public static sanitizeKeyAndAddUniqueness(key: any, map: any) {
		const origLength = key.length
		let field = DataSanitizer.sanitizeKey(key)

		// validation truncated the length.  We need to add uniqueness
		if (field.length !== origLength) {
			let i = 0
			let uniqueField = field
			while (map[uniqueField] !== undefined) {
				i += 1
				uniqueField = field.substring(0, DataSanitizer.MAX_NAME_LENGTH - 3) + DataSanitizer.padNumber(i)
			}
			field = uniqueField
		}
		return field
	}

	public static sanitizeKey(name: any) {
		let nameTrunc: String
		if (name) {
			// Remove any leading or trailing whitepace
			name = DataSanitizer.trim(name.toString())

			// truncate the string to 150 chars
			if (name.length > DataSanitizer.MAX_NAME_LENGTH) {
				nameTrunc = name.substring(0, DataSanitizer.MAX_NAME_LENGTH)
			}
		}

		return nameTrunc || name
	}

	public static sanitizeString(value: any, maxLength: number = DataSanitizer.MAX_STRING_LENGTH) {
		let valueTrunc : String
		if (value) {
			maxLength = maxLength || DataSanitizer.MAX_STRING_LENGTH // in case default parameters dont work
			value = DataSanitizer.trim(value)
			if (value.toString().length > maxLength) {
				valueTrunc = value.toString().substring(0, maxLength)
			}
		}

		return valueTrunc || value
	}

	public static sanitizeUrl(url: any) {
		return DataSanitizer.sanitizeInput(url, DataSanitizer.MAX_URL_LENGTH)
	}

	public static sanitizeMessage(message: any) {
		let messageTrunc : String
		if (message) {
			if (message.length > DataSanitizer.MAX_MESSAGE_LENGTH) {
				messageTrunc = message.substring(0, DataSanitizer.MAX_MESSAGE_LENGTH)
			}
		}

		return messageTrunc || message
	}

	public static sanitizeException(exception: any) {
		let exceptionTrunc : String
		if (exception) {
			if (exception.length > DataSanitizer.MAX_EXCEPTION_LENGTH) {
				exceptionTrunc = exception.substring(0, DataSanitizer.MAX_EXCEPTION_LENGTH)
			}
		}

		return exceptionTrunc || exception
	}

	public static sanitizeProperties(properties: any) {
		if (properties) {
			const tempProps = {}
			for (let prop in properties) {
				let value = properties[prop]
				if (typeof value === 'object') {
					// Stringify any part C properties
					try {
						value = JSON.stringify(value)
					} catch (e) {
						console.log(e) // Not thrown so you don't crash cloudflare function
					}
				}
				value = DataSanitizer.sanitizeString(value, DataSanitizer.MAX_PROPERTY_LENGTH)
				prop = DataSanitizer.sanitizeKeyAndAddUniqueness(prop, tempProps)
				tempProps[prop] = value
			}
			properties = tempProps
		}

		return properties
	}

	public static sanitizeMeasurements(measurements: any) {
		if (measurements) {
			const tempMeasurements = {}
			for (let measure in measurements) {
				const value = measurements[measure]
				measure = DataSanitizer.sanitizeKeyAndAddUniqueness(measure, tempMeasurements)
				tempMeasurements[measure] = value
			}
			measurements = tempMeasurements
		}

		return measurements
	}

	public static sanitizeId(id: string): string {
		return id ? DataSanitizer.sanitizeInput(id, DataSanitizer.MAX_ID_LENGTH).toString() : id
	}

	public static sanitizeInput(input: any, maxLength: number) {
		let inputTrunc : String
		if (input) {
			input = DataSanitizer.trim(input)
			if (input.length > maxLength) {
				inputTrunc = input.substring(0, maxLength)
			}
		}

		return inputTrunc || input
	}

	public static padNumber(num: number) {
		const s = `00${num}`
		return s.substr(s.length - 3)
	}

	public static trim(str: any): string {
		if (typeof str === 'string') { return str }
		return str.replace(/^\s+|\s+$/g, '')
	}
}
