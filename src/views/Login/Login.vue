<template>
  <div class="login">
    <LoginHeader>
      <!-- 用Form包裝要submit東西 -->
      <el-form
        :rules="rules"
        :model="ruleForm"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        slot="container"
      >
        <div class="title">
          <h3>LOGIN</h3>
        </div>
        <!-- username -->
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            auto-complete="off"
            placeholder="username"
          >
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </el-form-item>

        <!-- password -->
        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="ruleForm.pwd"
            auto-complete="off"
            placeholder="password"
          >
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>

        <!-- button -->
        <el-form-item>
          <el-button
            :loading="isLogin"
            @click.native.prevent="handleSubmit"
            type="primary"
            style="width: 100%"
            >Login</el-button
          >
        </el-form-item>

        <!-- hint -->
        <el-form-item>
          <el-checkbox
            v-model="ruleForm.autoLogin"
            :checked="ruleForm.autoLogin"
            >Auto-login in 7 days</el-checkbox
          >
          <el-button
            @click="$router.push('/password')"
            type="text"
            class="forget"
            >Forget your password?</el-button
          >
        </el-form-item>
      </el-form>
    </LoginHeader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator"; // Provide可以當作設置組件內data
import { State, Getter, Mutation, Action } from "vuex-class";
import LoginHeader from "./LoginHeader.vue";

@Component({
  components: { LoginHeader },
})
export default class Login extends Vue {
  @Action("setUser") setUser: any;

  @Provide() isLogin: boolean = false;
  @Provide() ruleForm: {
    username: String;
    pwd: String;
    autoLogin: boolean;
  } = {
    username: "",
    pwd: "",
    autoLogin: true,
  };

  @Provide() rules = {
    username: [
      { required: true, message: "plz enter your username", trigger: "blur" },
    ],
    pwd: [
      { required: true, message: "plz enter your password", trigger: "blur" },
    ],
  };

  handleSubmit(): void {
    (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
      if (valid) {
        this.isLogin = true;
        (this as any).$axios
          .post("/api/users/login", this.ruleForm)
          .then((res: any) => {
            this.isLogin = false;
            const token = res.data.token;
            // 存放到vuex內 同時也要設置到localStorage 避免刷新頁面把資料洗掉
            localStorage.setItem("tsToken", token);
            this.setUser(token);
            this.$router.push("/");
          })
          .catch((err: any) => {
            console.log("err---", err);
            this.isLogin = false;
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

i {
  font-size: 14px;
  margin-left: 8px;
}
.forget {
  float: right;
}
</style>

