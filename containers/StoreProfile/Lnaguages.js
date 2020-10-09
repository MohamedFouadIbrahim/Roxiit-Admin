import React, { Component } from 'react'
import { FlatList, View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { secondColor } from '../../constants/Colors.js';
import FontedText from '../../components/FontedText/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CheckBox from '../../components/CheckBox/index';
import { connect } from 'react-redux'
import CustomTouchable from '../../components/CustomTouchable';


class Languages extends Component {
    constructor(props) {
        super(props)
        const { languages_data, currLang } = this.props

        this.state = {
            lockSubmit: false,
            didFetchData: false,
            triggerListRender: false,
            Languages: this.props.route.params?.SelectedLanguages,
        }

        if (this.props.route.params && this.props.route.params?.SelectedLanguages) {
            this.SelectedLanguages = this.props.route.params?.SelectedLanguages
        }

    }

    componentWillUnmount() {
        this.cancelDataFich && this.cancelDataFich()
    }

    // componentDidMount() {
    //     const data = [
    //         ...this.state.Languages.filter(item => this.SelectedLanguages.includes(item.key)).map(item => ({ ...item, isSelected: true, })),
    //         ...this.state.Languages.filter(item => !this.SelectedLanguages.includes(item.key)).map(item => ({ ...item, isSelected: false }))
    //     ]
    //     this.setState({ Languages: data })
    // }

    submit = () => {
        // const Result = this.state.Languages.filter(item => item.isSelected == true)
        // const Ids = Result.map((value, index) => value.key)
        this.props.route.params?.onSelect(this.state.Languages)
    }


    onSelecLanguages = (item, index) => {

        const copy_items = this.state.Languages
        copy_items[index].isSelected = !copy_items[index].isSelected

        this.setState({
            Languages: copy_items,
            triggerListRender: !this.state.triggerListRender,
        })

    }

    renderItem = ({ item, index }) => {
        const { Name, isSelected } = item
        return (
            <CustomTouchable
                key={index}
                activeOpacity={0.85}
                onPress={() => {
                    this.onSelecLanguages(item, index);
                }}
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}>
                <FontedText style={{ color: secondColor }}>{Name}</FontedText>

                <CheckBox
                    selected={isSelected}
                />
            </CustomTouchable>
        )

    }


    renderContent = () => {
        if (this.state.Languages.length > 0) {
            return (
                <FlatList
                    keyExtractor={(item, index) => String(index)}
                    extraData={this.state.triggerListRender}
                    data={this.state.Languages}
                    renderItem={this.renderItem} />
            )
        }
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
                <CustomHeader
                    leftComponent='back'
                    onBack={() => {
                        this.submit()
                    }}
                    navigation={this.props.navigation}
                    title={"Languages"}
                // rightComponent={
                //     <HeaderSubmitButton
                //         isLoading={this.state.lockSubmit}
                //         didSucceed={this.state.didSucceed}
                //         onPress={() => { this.submit() }} />
                // } 
                />

                {this.renderContent()}

            </LazyContainer>
        )
    }
}
const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    },
}) => ({
    languages_data,
    currLang,
})
export default connect(mapStateToProps)(withLocalize(Languages))