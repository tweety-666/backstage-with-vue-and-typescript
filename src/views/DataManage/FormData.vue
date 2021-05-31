<template>
  <div class="form-data">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px">
      <el-form-item label="class subject" prop="title">
        <el-input
          v-model="form.title"
          placeholder="plz enter class subject"
        ></el-input>
      </el-form-item>
      <el-form-item label="class level" prop="level">
        <el-select v-model="form.level" placeholder="plz select class level">
          <el-option label="junior" value="junior"></el-option>
          <el-option label="medium" value="medium"></el-option>
          <el-option label="advanced" value="advanced"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="registor total" prop="count">
        <el-input
          v-model="form.count"
          placeholder="plz enter registor total"
        ></el-input>
      </el-form-item>
      <el-form-item label="release date" prop="date">
        <el-date-picker
          type="date"
          placeholder="select a date"
          v-model="form.date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="subject" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="vue" name="type"></el-radio>
          <el-radio label="react" name="type"></el-radio>
          <el-radio label="node" name="type"></el-radio>
          <el-radio label="angular" name="type"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm')" type="primary"
          >create</el-button
        >
        <el-button @click="resetForm('ruleForm')">reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
@Component({
  components: {},
})
export default class FormData extends Vue {
  @Provide() form: object = {
    title: "",
    type: "",
    level: "",
    count: "",
    date: "",
  };

  @Provide() rules: any = {
    title: [
      { required: true, message: "plz enterclass subject", trigger: "blur" },
    ],
    level: [
      { required: true, message: "plz selectclass level", trigger: "change" },
    ],
    count: [
      { required: true, message: "plz enter registor total", trigger: "blur" },
    ],
    date: [
      {
        type: "string",
        required: true,
        message: "plz select a date",
        trigger: "change",
      },
    ],
    type: [
      {
        required: true,
        message: "plz select a subject",
        trigger: "change",
      },
    ],
  };

  submitForm(formName: string) {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post(`api/profiles/add`, this.form)
          .then((res: any) => {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.resetForm(formName);
          });
      }
    });
  }

  resetForm(formName: string) {
    (this as any).$refs[formName].resetFields();
  }
}
</script>

<style lang="scss" scoped>
.form-data {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  padding: 35px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);

  .el-input,
  .el-select {
    width: 200px !important;
  }
  .division {
    margin: 0 10px;
    color: #606266;
  }
}
</style>
