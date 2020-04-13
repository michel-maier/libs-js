import {ComponentType} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import withStyles, {Styles} from '@material-ui/core/styles/withStyles';

export const component = <P = any>(styles: Styles<any, any>|undefined|null|boolean, c: ComponentType<any>, mapStateToProps: any = undefined): ComponentType<P> => {
    c = mapStateToProps ? ((true !== mapStateToProps) ? connect(mapStateToProps) : connect())(c) : c;
    c = withTranslation()(c);
    c = !!styles ? withStyles(styles as Styles<any, any>)(c) : c;
    return c as ComponentType<P>;
}

export default component