import React from 'react'
import { View, StyleSheet } from 'react-native'
import FontedText from '../../components/FontedText'
import { redColor, mainColor } from '../../constants/Colors'
import { largePagePadding, pagePadding } from '../../constants/Style'
import { connect } from 'react-redux';

class RowItem extends React.Component {

    renderCategories = (Categories) => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                {Categories.map(({ Name }, index) => (
                    <FontedText key={index} style={[Styles.MainText, { paddingHorizontal: index != 0 ? 5 : 0 }]}>
                        {Name}
                    </FontedText>
                ))}
            </View>
        )
    }

    renderImages = (Images) => {
        return Images.map((item, index) => (
            <FontedText key={index} style={Styles.MainText}>
                {item}
            </FontedText>
        ))
    }
    render() {
        const {
            Price,
            RealPrice,
            SalePrice,
            Categories,
            isError,
            ErrorText,
            Name,
            Images,
            SecondLangName,
        } = this.props.item

        const { Currency } = this.props
        
        return (
            <View style={{ marginBottom: pagePadding, paddingHorizontal: largePagePadding }} >

                {isError == true && ErrorText ? <FontedText style={[Styles.MainText, { color: redColor, marginBottom: 5, fontWeight: 'bold' }]} >
                    {ErrorText}
                </FontedText> : null}

                <FontedText style={[Styles.MainText,{marginTop:5}]} >
                    {Name}
                </FontedText>

                {SecondLangName ? <FontedText style={Styles.MainText} >
                    {SecondLangName}
                </FontedText> : null}

                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    {Price ? <FontedText style={Styles.MainText} >
                        {`${Price} ${Currency.Name}`}
                    </FontedText> : null}


                    {SalePrice ? <FontedText style={[Styles.MainText, { paddingHorizontal: 5 }]} >
                        {`, ${SalePrice} ${Currency.Name}`}
                    </FontedText> : null}

                    {RealPrice ? <FontedText style={[Styles.MainText, { paddingHorizontal: 5 }]} >
                        {`, ${RealPrice} ${Currency.Name}`}
                    </FontedText> : null}

                </View>

                {this.renderCategories(Categories)}

                {this.renderImages(Images)}
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    MainText: {
        marginTop: 0,
        // marginVertical: 2,
        color: mainColor
    }
})
const mapStateToProps = ({
    login: {
        Currency
    }
}) => ({
    Currency
})
export default connect(mapStateToProps)(RowItem)