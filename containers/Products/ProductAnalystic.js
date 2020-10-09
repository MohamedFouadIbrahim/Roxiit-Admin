import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import FontedText from '../../components/FontedText';
import { GETProductAnalytics } from '../../services/ProductService';
import HorizontalInput from '../../components/HorizontalInput';
import { ScrollView } from 'react-native';


class ProductAnalytic extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            dataFitched: false
        }
    }

    componentDidMount() {

        GETProductAnalytics(this.props.ProductId, res => {
            this.setState({ ...res.data, dataFitched: true })
        })

    }

    render() {

        const {
            TodayViews,
            YesterdayViews,
            ThisWeekViews,
            ThisMonthViews,
            Days30BeforeViews,
            Days7BeforeViews
        } = this.state

        return (
            <LazyContainer style={{ flex: 1 }} >
                <ScrollView>
                    <HorizontalInput
                        editable={false}
                        value={String(TodayViews)}
                        label={'TodayViews'}
                    />
                    <HorizontalInput
                        editable={false}
                        value={String(YesterdayViews)}
                        label={'YesterdayViews'}
                    />
                    <HorizontalInput
                        editable={false}
                        value={String(ThisWeekViews)}
                        label={'ThisWeekViews'}
                    />
                    <HorizontalInput
                        editable={false}
                        value={String(ThisMonthViews)}
                        label={'ThisMonthViews'}
                    />
                    <HorizontalInput
                        editable={false}
                        value={String(Days30BeforeViews)}
                        label={'Days30BeforeViews'}
                    />
                    <HorizontalInput
                        editable={false}
                        value={String(Days7BeforeViews)}
                        label={'Days7BeforeViews'}
                    />
                </ScrollView>
            </LazyContainer>
        )
    }
}
export default ProductAnalytic