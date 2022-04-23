import Bbb from './src/main';

/* istanbul ignore next */
Bbb.install = function(Vue) {
  Vue.component(Bbb.name, Bbb);
};

export default Bbb;
