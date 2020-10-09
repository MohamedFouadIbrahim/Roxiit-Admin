import React from 'react';
import RemoteImage from '../RemoteImage';

export default (props) => {
	const {
		style,
		size = 56,
		dimension = 250,
		uri,
		...otherProps
	} = props;
	
	return (
		<RemoteImage
			uri={uri}
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				...style
			}} 
			dimension={dimension}
			wide={false}
			{...otherProps} />
	)
}