import {Message} from 'element-ui';

const message = {
  success: (content) => {
    Message({
      type: 'success',
      message: content,
      showClose: false,
      duration: 1500,
    });
  },
  warning: (content) => {
    Message({
      type: 'warning',
      message: content,
      showClose: false,
      duration: 2000,
    });
  },
  info: (content) => {
    Message({
      message: content,
      showClose: false,
      duration: 1000,
    });
  },
  error: (content) => {
    const errorInfo = content.msg || content;
    Message({
      type: 'error',
      message: errorInfo,
      showClose: false,
      duration: 3000,
    });
  },
};

export default message;
