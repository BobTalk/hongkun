export default {
  name: "WrapperButton",
  data() {
    return {
    }
  },
  props: {
    //text 按钮文本
    text: {
      type: String,
      default: "",
    },
    //type	类型:	primary / success / warning / danger / info / text  or icon
    type: {
      type: String,
      default: "",
    },
    //size	尺寸:	medium / small / mini
    size: {
      type: String,
      default: "medium",
    },
    //icon	图标类名
    icon: {
      type: String,
      default: "",
    },
    //icon	绑定权限字符串,用逗号分隔  eq:"project.add,project.edit"
    //TODO 权限判断 支持正则表达式
    permission: {
      type: String,
      default: "",
    }
  },
  methods: {
    innerClick: function (e) {
      this.$emit("click",e);
    },
  },

  render() {
    // window.Wrapperutton = this;
    const {text, type, icon, size} = this.$props;
    if (type == "icon") {
      return (
        <span><i class={icon} onClick={this.innerClick}></i></span>
      );
    }
    return (
      <span>
        <el-button type={type} icon={icon} size={size} onClick={this.innerClick}>
          {text}
        </el-button>
      </span>
    )
  }
}
