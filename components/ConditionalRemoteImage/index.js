import React from 'react';
import { Image } from 'react-native'
import RemoteImage from '../RemoteImage';

export default (props) => {
	const {
		remote = false, // if a remote image or not
		uri,
		...otherProps
	} = props;
	
	if (remote) {
		return (
			<RemoteImage
				uri={uri}
				{...otherProps} />
		)
	}
	else {
		return (
			<Image
				source={{
					uri
				}} 
				{...otherProps} />
		)
	}
}