console.log("start")

// 计时器
var timer = null
var COUNTDOWN_SECONDS = 60
var mobileRegex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/

$(function () {
  $(".js-tab-btn").hover(function () {
    var tabIndex = $(this).index()

    console.log(tabIndex)
    // $(this).toggleClass("hover");

    $('.js-tab').eq(tabIndex).show().siblings('.js-tab').hide()
  });
})


// 注册弹框
new Vue({
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
        url: '/verify',
        type: "GET",
        dataType: 'json',
        data: {
          mobileNo: this.loginForm.mobileNo,
          //   // 0 表示注册
          //   type: MESSAGE_TYPE.REGISTER
        },
        success(res) {
          var res = {success: true}

          if (res && res.success) {
            that.countdown = COUNTDOWN_SECONDS
            that.$message({
              message: '短信已发送，请注意查收！',
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

          }

        },
        error(res) {
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
            url: '/register',
            type: "GET",
            dataType: 'json',
            data: {
              // ...this.loginForm,
              // password: md5(this.loginForm.password, 32),
              password: this.loginForm.password,
              passwordAgain: null,
            },
            success(res) {
              if (res && res.success) {
                that.loading = false
              } else {
                console.log('error submit!!')
                that.loading = false
                return false
              }
            },
            error(res) {
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
