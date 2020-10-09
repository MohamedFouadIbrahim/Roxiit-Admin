export const TrimText = (text, max_length) => {
	return text.length > max_length ? `${text.slice(0, max_length - 2)}..` : text
}