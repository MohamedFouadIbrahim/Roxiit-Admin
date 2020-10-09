export const numeral = (num) => {
	if (num / 1000 >= 1) {
		return `${num / 1000}k`
	} else {
		return num
	}
}

export const generateRandomNumber = (n) => {
	var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

	if (n > max) {
		return generateRandomNumber(max) + generateRandomNumber(n - max);
	}

	max = Math.pow(10, n + add);
	var min = max / 10; // Math.pow(10, n) basically
	var number = Math.floor(Math.random() * (max - min + 1)) + min;

	return ("" + number).substring(add);
}

export const convertNumbers2English = (string) => {
	const ar = string.replace(/[\u0660-\u0669]/g, function (c) {
		return c.charCodeAt(0) - 0x0660;
	}).replace(/[\u06f0-\u06f9]/g, function (c) {
		return c.charCodeAt(0) - 0x06f0;
	});
	
	return ar.replace('٫','.')
}

export const GetTimeFromNumber = (number) => { // Get Time Format From number of minutes
	var num = number;
	var hours = (num / 60);
	var rhours = Math.floor(hours);
	var minutes = (hours - rhours) * 60;
	var rminutes = Math.round(minutes);
	return rhours + " : " + rminutes;
}