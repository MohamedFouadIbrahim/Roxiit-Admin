import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/max'

export const isValidEmail = (email) => {
	return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
}

export const isValidURL = (url) => {
	const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
		'(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i');
		
	return pattern.test(url)
}

export const isValidMobileNumber = (number_with_code) => {
	const parsedMobile = parseMobile(number_with_code)
	return parsedMobile ? parsedMobile.isValid() : false
}

export const isValidPassword = (password) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(password);
}


export const isValidHexColor = (hexColor) => {
	return /^#[0-9a-f]{6}$/i.test(hexColor);
}
export const isUrlValid = (userInput) => {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

export const isValidSearchKeyword = (keyword) => {
	return keyword && keyword.length && keyword.replace(/\s/g, '').length;
}
