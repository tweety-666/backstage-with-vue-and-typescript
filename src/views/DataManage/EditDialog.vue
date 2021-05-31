<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    title="edit"
    :visible.sync="dialogVisible"
  >
    <el-form
      :rules="rules"
      ref="ruleForm"
      :model="form"
      label-width="100px"
      size="small"
      class="form-box"
    >
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')" size="small">cancel</el-button>
      <el-button @click="submitForm('ruleForm')" type="primary" size="small"
        >confirm</el-button
      >
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from "vue-property-decorator";
@Component({
  components: {},
})
export default class EditDialog extends Vue {
  @Prop(Boolean) dialogVisible!: boolean;
  @Prop(Object) form!: {
    title: string;
    type: string;
    level: string;
    count: string;
    date: string;
    _id: string;
  };

  @Provide() rules: any = {
    title: [
      { required: true, message: "plz enter class subject", trigger: "blur" },
    ],
    level: [
      { required: true, message: "plz select class level", trigger: "change" },
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

  submitForm(formName: any) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post(`/api/profiles/edit/${this.form._id}`)
          .then((res: any) => {
            this.$emit("closeDialog");
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  .el-input,
  .el-select {
    width: 200px !important;
  }
}
</style>
