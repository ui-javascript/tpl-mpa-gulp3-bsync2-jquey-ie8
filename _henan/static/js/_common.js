// 0）全局配置 ====
// IE支持跨域
jQuery.support.cors = true;

// 1) 全局变量 ====
// 开发环境
var commonURL = "http://172.16.11.175:7066"

// 正式环境
// const commonURL = ""


// 2) 全局方法 ====
// 获取参数
function getUrlParam(name, origin = null) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = null;
  if (origin == null) {
    r = window.location.search.substr(1).match(reg);
  } else {
    r = origin.substr(1).match(reg);
  }
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}


// ===

// 3) 公共业务逻辑 ====
// 计时器
var timer = null
var COUNTDOWN_SECONDS = 60
var mobileRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/

// 控制弹框显示隐藏
function handleModalVisible(visible) {
  vueInstance.dialogVisible = !!visible
}

function isIE() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  }

  return false;
}

layui.use([
  'layer'
], () => {
  const layer = layui.layer

  $('#btn_reg').on('click', function () {

    if (isIE()) {
      layer.alert("注册功能不支持IE浏览器, 请使用Chrome浏览器或使用360、QQ、搜狗等国产浏览器并切换至极速模式");
      return;
    }
    handleModalVisible(true);
  });
})


// 注册弹框
const vueInstance = new Vue({
  el: '#app',
  data: {
    dialogVisible: false,
    loginForm: {
      mobileNo: '',
      name: '',
      password: '',
      passwordAgain: '',
      verifyCode: '',
    },

    // 校验规则
    loginRules: {
      enterpriceName: [
        {required: true, trigger: 'blur', message: '必填'},
      ],
      mobileNo: [
        {required: true, trigger: 'blur', message: '必填'},
        {trigger: 'blur', pattern: mobileRegex, message: '手机格式不正确'},
        // 判断是否已注册
        // { trigger: 'blur', validator: validateHasRegister }
      ],
      verifyCode: [{required: true, trigger: 'blur', message: '必填'}],
      name: [{required: true, trigger: 'blur', message: '必填'}],
      password: [{required: true, trigger: 'blur', min: 6, max: 12, message: '密码介于6-12位'}],
      passwordAgain: [
        // { required: true, trigger: 'blur', validator: validatePasswordAgain }
      ],
    },

    // 是否注册成功
    passwordType: 'password',
    loading: false,

    // 倒计时
    countdown: 0,
  },
  destroyed() {
    timer && clearInterval(timer)
  },
  methods: {
    handleSendVerifyCode() {

      const that = this

      $.ajax({
        url: commonURL + '/PMSoft.AjaxHttpHandler.ExamGetValidateCode.ashx',
        type: "GET",
        // dataType: 'json',
        data: {
          tel: this.loginForm.mobileNo,
          //   // 0 表示注册
          //   type: MESSAGE_TYPE.REGISTER
        },
        success(res) {

          const resp = JSON.parse(res)
          if (resp && resp.result) {
            that.countdown = COUNTDOWN_SECONDS
            that.$message({
              message: resp.msg || '短信已发送，请注意查收！',
              type: 'success'
            })

            timer = setInterval(() => {
              if (that.countdown <= 0) {
                that.countdown = 0
                clearInterval(timer)
              } else {
                that.countdown--
              }
            }, 1000)

          } else {
            that.$message({
              message: resp.msg || '短信发送失败！',
              type: 'error'
            })
          }

        },
        error(res) {
          debugger
          that.$message({
            message: '短信发送失败',
            type: 'error'
          })
          // this.countdown = 0
          // clearInterval(timer)
        }
      })


    },

    handleRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {

          if ($.trim(this.loginForm.password) != $.trim(this.loginForm.passwordAgain)) {
            this.$message({
              message: '两次输入密码不一致',
              type: 'error'
            })
            return
          }

          this.loading = true

          const that = this

          $.ajax({
            url: commonURL + '/PMSoft.AjaxHttpHandler.ExamRegister.ashx',
            type: "GET",
            // dataType: 'json',
            data: {
              // ...this.loginForm,
              tel: this.loginForm.mobileNo,
              enterpriceName: this.loginForm.enterpriceName,
              checkCode: this.loginForm.verifyCode,
              // password: md5(this.loginForm.password, 32),
              password: this.loginForm.password,
              // passwordAgain: null,
            },
            success(res) {
              debugger
              const resp = JSON.parse(res)

              if (resp && resp.result) {
                that.$message({
                  message: resp.msg || '注册成功',
                  type: 'success'
                })
                handleModalVisible(false)
              } else {
                that.$message({
                  message: resp.msg || '注册失败',
                  type: 'error'
                })
              }
              that.loading = false


            },
            error(res) {
              debugger
              that.$message({
                message: '注册失败',
                type: 'error'
              })
              that.loading = false
            }
          })

        }
      })
    }

  }
})



