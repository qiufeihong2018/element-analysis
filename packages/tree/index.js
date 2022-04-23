import Tree from './src/tree.vue';
// 注册组件 tree
/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
};
// 抛出组件 tree
export default Tree;
