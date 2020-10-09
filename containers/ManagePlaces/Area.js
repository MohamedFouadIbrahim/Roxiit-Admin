import React from 'react'
import LazyContainer from '../../components/LazyContainer';
import HorizontalInput from '../../components/HorizontalInput';
import CustomHeader from '../../components/CustomHeader';
import { GEtAddEditArea, AddEditArea } from '../../services/ManagePlaces';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { LongToast } from '../../utils/Toast';

class Area extends React.Component {

    constructor(props) {

        super(props)

        const {
            Id,
            CityId,
        } = this.props.route.params

        if (Id == 0) {

            this.editMode = false

        } else {

            this.editMode = true

        }

        this.state = {
            Id,
            Name: null,
            CityId,
            didDataFetched: false,
            lockSubmit: false
        }

        this.lockSubmit = false

    }

    submit = () => {

        if (this.state.lockSubmit) {
            return
        }

        const {
            onChildChange
        } = this.props.route.params

        const { Name, Id, CityId } = this.state

        if (!Name) {
            return LongToast('CantHaveEmptyInputs')
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true


        AddEditArea({
            Id: this.editMode ? Id : 0,
            Name,
            ParentId: CityId
        }, res => {

            this.setState({ lockSubmit: false })
            this.lockSubmit = false
            LongToast('dataSaved')
            onChildChange && onChildChange()
            this.props.navigation.goBack()

        }, err => {

            this.setState({ lockSubmit: false })
            this.lockSubmit = false

        })
    }

    componentDidMount() {
        const {
            Id,
        } = this.state


        if (this.editMode) {
            GEtAddEditArea(Id, res => {
                this.setState({ ...res.data, didDataFetched: true })
            })
        }

    }

    render() {
        const { Name } = this.state
        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    title='Area'
                    navigation={this.props.navigation}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            onPress={this.submit}
                        />
                    }
                />

                <HorizontalInput
                    label="Name"
                    value={Name}
                    onChangeText={(Name) => { this.setState({ Name }) }}
                />

            </LazyContainer>
        )
    }
}

export default Area