<template>
  <!-- 表单容器el-form -->
  <form class="el-form" :class="[
    labelPosition ? 'el-form--label-' + labelPosition : '',
    { 'el-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
<script>
  import objectAssign from 'element-ui/src/utils/merge';

  export default {
    name: 'ElForm',

    componentName: 'ElForm',
    // https://cn.vuejs.org/v2/api/#provide-inject
    // 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。
    provide() {
      return {
        elForm: this
      };
    },

    props: {
      // 数据
      model: Object,
      // 规则
      rules: Object,
      // label的位置
      labelPosition: String,
      // label的宽度
      labelWidth: String,
      // 表单域标签的后缀
      labelSuffix: {
        type: String,
        default: ''
      },
      // 是否在行内
      inline: Boolean,
      // 是否以行内形式展示校验信息
      inlineMessage: Boolean,
      // 是否在输入框中显示校验结果反馈图标
      statusIcon: Boolean,
      // 是否显示校验错误信息
      showMessage: {
        type: Boolean,
        default: true
      },
      // 用于控制该表单内组件的尺寸
      size: String,
      // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
      disabled: Boolean,
      // 是否在 rules 属性改变后立即触发一次验证
      validateOnRuleChange: {
        type: Boolean,
        default: true
      },
      // 是否显示必填字段的标签旁边的红色星号
      hideRequiredAsterisk: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      rules() {
        // 在form规则更改后，删除并添加form-item上的新的事件监听器
        // remove then add event listeners on form-item after form rules change
        this.fields.forEach(field => {
          // 移除表单验证
          field.removeValidateEvents();
          // 增加表单验证
          field.addValidateEvents();
        });
        // rules 属性改变后立即触发一次验证
        if (this.validateOnRuleChange) {
          this.validate(() => {});
        }
      }
    },
    computed: {
      autoLabelWidth() {
        if (!this.potentialLabelWidthArr.length) return 0;
        const max = Math.max(...this.potentialLabelWidthArr);
        return max ? `${max}px` : '';
      }
    },
    data() {
      return {
        // 验证规则项
        fields: [],
        potentialLabelWidthArr: [] // use this array to calculate auto width
      };
    },
    created() {
      this.$on('el.form.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      resetFields() {
        if (!this.model) {
          // 没有数据(提示:数据是重置数据必须的)
          console.warn('[Element Warn][Form]model is required for resetFields to work.');
          return;
        }
        this.fields.forEach(field => {
          field.resetField();
        });
      },
      // 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
      clearValidate(props = []) {
        const fields = props.length ?
          (typeof props === 'string' ?
            this.fields.filter(field => props === field.prop) :
            this.fields.filter(field => props.indexOf(field.prop) > -1)
          ) : this.fields;
        fields.forEach(field => {
          field.clearValidate();
        });
      },
      // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      validate(callback) {
        // 没有数据(提示:验证中数据是必须的)
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!');
          return;
        }

        let promise;
        // 如果没有回调返回promise
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function (valid) {
              valid ? resolve(valid) : reject(valid);
            };
          });
        }

        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        let invalidFields = {};
        // 遍历验证规则项
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false;
            }
            invalidFields = objectAssign({}, invalidFields, field);
            //  遍历结束，返回通过的验证规则
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields);
            }
          });
        });

        if (promise) {
          return promise;
        }
      },
      // 对部分表单字段进行校验的方法
      validateField(props, cb) {
        // 转化为数组
        props = [].concat(props);
        // 过滤使用prop的字段
        // 如
        //         <el-form-item label="活动名称" prop="name">
        //   <el-input v-model="ruleForm.name"></el-input>
        // </el-form-item>
        const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
        // 没有就警告
        if (!fields.length) {
          console.warn('[Element Warn]please pass correct props!');
          return;
        }
        // 有的话就验证
        fields.forEach(field => {
          field.validate('', cb);
        });
      },
      getLabelWidthIndex(width) {
        const index = this.potentialLabelWidthArr.indexOf(width);
        // it's impossible
        if (index === -1) {
          throw new Error('[ElementForm]unpected width ', width);
        }
        return index;
      },
      registerLabelWidth(val, oldVal) {
        if (val && oldVal) {
          const index = this.getLabelWidthIndex(oldVal);
          this.potentialLabelWidthArr.splice(index, 1, val);
        } else if (val) {
          this.potentialLabelWidthArr.push(val);
        }
      },
      deregisterLabelWidth(val) {
        const index = this.getLabelWidthIndex(val);
        this.potentialLabelWidthArr.splice(index, 1);
      }
    }
  };
</script>