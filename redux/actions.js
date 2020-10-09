import { actions as LangActions } from './LangRedux'
import { actions as LoginActions } from './LoginRedux'
import { actions as WalkthroughActions } from './WalkthroughRedux'

export default {
  ...LangActions,
  ...LoginActions,
  ...WalkthroughActions,
}