<div id="app" v-cloak>

  <el-dialog
    title="用户注册"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
    width="500px">


    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-width="80px"
      autocomplete="on"
      label-position="right"
    >

      <el-form-item prop="enterpriceName" label="企业名称">


        <el-input
          v-model.trim="loginForm.enterpriceName"
          placeholder="请输入企业名称"
          name="enterpriceName"
          type="text"
          tabindex="1"
          autocomplete="on"
        ></el-input>

      </el-form-item>

      <el-form-item prop="mobileNo" label="手机号">

        <el-input
          v-model.trim="loginForm.mobileNo"
          placeholder="请输入您的手机号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        ></el-input>

      </el-form-item>

      <div class="relative">
        <el-form-item prop="verifyCode" label="验证码">

          <el-input
            v-model.trim="loginForm.verifyCode"
            style="width: 220px"
            placeholder="请输入验证码"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          ></el-input>

        </el-form-item>

        <div class="inline-block absolute" style="top: 0; width: 110px;right: 13px;">
          <el-button
            type="primary"
            class="btnVerify tc"
            :disabled="shouldDisableVerifyCode"
            @click.native.prevent="handleSendVerifyCode"
          >
            {{ getVerifyCodeTip() }}
          </el-button>
        </div>

      </div>


      <el-form-item prop="password" label="密码">

        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码(6-12位)"
          name="password"
          tabindex="2"
          autocomplete="on"
          @blur="capsTooltip = false"
        ></el-input>

      </el-form-item>

      <el-form-item prop="passwordAgain" label="确认密码">

        <el-input
          v-model.trim="loginForm.passwordAgain"
          :type="passwordType"
          placeholder="请输入确认密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @blur="capsTooltip = false"
        ></el-input>

      </el-form-item>


      <div class="tc">
        <div>
          <el-button
            :loading="loading"
            type="primary"
            class="btnRegister inline-block"
            style="width:170px;height: 50px;"
            @click.native.prevent="handleRegister"
          >注册</el-button>
        </div>

      </div>

    </el-form>


  </el-dialog>

</div>
