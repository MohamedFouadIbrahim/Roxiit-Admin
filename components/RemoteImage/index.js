import React from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux'

// Refer to:
// https://dev.azure.com/Roxiit-Doc/Public/_wiki/wikis/Public.wiki?pagePath=%2FRoxiit%2FRoxiit%20%252D%20Hello%20world%2FTechnical%20Note&pageId=11&wikiVersion=GBwikiMaster
// https://dev.azure.com/Roxiit-Mobile/Admin/_workitems/edit/202


const RemoteImage = (props) => {
	const {
		dimension = 1080,
		wide = false,
		uri,
		ImageScalingType,
		PadScalingColor,
		...otherProps
	} = props
	
	return (
		<Image 
			source={{ 
				uri: `${uri}?size=${dimension}&wide=${wide}&ImageScalingType=${ImageScalingType.Value}&PadScalingColor=${PadScalingColor.Value}` 
			}} 
			{...otherProps} />
	)
}

const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			screens: {
				Product_Details_09_5: {
					ImageScalingType,
					PadScalingColor,
				}
			},
		},
	},
}) => ({
	ImageScalingType,
	PadScalingColor,
})

export default connect(mapStateToProps)(RemoteImage)