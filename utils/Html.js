import { store } from "../Store";

export const FixHtmlTextColor = (html, color) => {
	const { textColor1 } = store.getState().runtime_config.runtime_config.colors

	return (
		`${html}<style>*{ color:${color || textColor1}!important; }</style>`
	)
}