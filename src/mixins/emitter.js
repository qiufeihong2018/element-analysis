/**
 * 广播事件
 * @param {*} componentName 组件名称
 * @param {*} eventName 事件名称
 * @param {*} params 参数
 */
function broadcast(componentName, eventName, params) {
  // 子组件遍历
  this.$children.forEach(child => {
    // 定义 name
    var name = child.$options.componentName;
    // 如果找到子组件，对应的子组件触发对应的方法，携带上参数
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // 如果没找到，继续递归查找
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
