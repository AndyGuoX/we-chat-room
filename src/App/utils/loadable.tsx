import React, {Component} from 'react';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


class LoadingComponent extends Component<LoadingComponentProps> {
  constructor(props: Readonly<Loadable.LoadingComponentProps>) {

    super(props);
    NProgress.start();
  }

  componentDidMount() {
    NProgress.done();
  }

  render() {
    return <div />;
  }
}

// TODO 组件类型写什么
export default (loader: any, loading = LoadingComponent) => {
  return Loadable({
    loader,
    loading
  });
}
