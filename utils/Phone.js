import { store } from '../Store'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const parsePhone = (full_phone_number) => {
	const phoneNumber = parsePhoneNumberFromString(full_phone_number)
	const countries = store.getState().places.countries
	let country = null
	let national = null

	if (phoneNumber) {
		const { country: countryCode, nationalNumber } = phoneNumber

		national = nationalNumber

		if (countryCode) {
			country = countries.find(item => item.ISOAlpha_2 === countryCode)

			if (!country) {
				// Default Jordan
				country = countries.find(item => item.Id === 110)
			}
		}
		else {
			// Default Jordan
			country = countries.find(item => item.Id === 110)
		}
	}
	else {
		// Default Jordan
		country = countries.find(item => item.Id === 110)
	}

	return {
		NumberCountry: country,
		NationalNumber: national || full_phone_number.replace(country.PhoneCode, ''),
		NumberCountryTwo: country,
		NationalNumberTwo: national || full_phone_number.replace(country.PhoneCode, ''),
	}
}