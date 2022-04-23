import Aaa from './src/main';

/* istanbul ignore next */
Aaa.install = function(Vue) {
  Vue.component(Aaa.name, Aaa);
};

export default Aaa;
