<template>
  <div class="account-data">
    <div class="add-box">
      <el-button @click="addAccount" type="primary">create account</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="role" width="180">
        <template slot-scope="scope">
          <el-select
            @change="selectChange(scope.row)"
            v-if="scope.row.edit"
            v-model="scope.row.role"
          >
            <el-option
              v-for="option in options"
              :label="option.role"
              :value="option.role"
              :key="option.key"
            ></el-option>
          </el-select>
          <span v-else>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="username" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.username"
            v-if="scope.row.edit"
          ></el-input>
          <span v-else>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="des" label="description"></el-table-column>
      <el-table-column label="action" width="180">
        <template slot-scope="scope" v-if="scope.row.username != 'admin'">
          <el-button
            @click="handleEdit(scope.$index, scope.row)"
            v-if="!scope.row.edit"
            size="mini"
            >edit</el-button
          >
          <el-button
            @click="handleSave(scope.$index, scope.row)"
            v-else
            type="success"
            size="mini"
            >okay</el-button
          >

          <el-button
            @click="handleDelete(scope.$index, scope.row)"
            size="mini"
            type="danger"
            >delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AddAccount
      @update="getData"
      @closeDialog="closeDialog"
      :dialogVisible="dialogVisible"
      :options="options"
    ></AddAccount>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import AddAccount from "./AddAccount.vue";
@Component({
  components: { AddAccount },
})
export default class AccountData extends Vue {
  @Provide() tableData: any = [];

  @Provide() dialogVisible: Boolean = false;

  @Provide() options: any = [
    {
      key: "admin",
      role: "admin",
      des: "Super Administrator. Have access to view all pages.",
    },
    {
      key: "editor",
      role: "editor",
      des: "Normal Editor. Can see all pages except permission page",
    },
    {
      key: "visitor",
      role: "visitor",
      des: "Just a visitor. Can only see the home page and the document page",
    },
  ];

  addAccount() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  created() {
    this.getData();
  }

  handleEdit(index: number, row: any): void {
    row.edit = true;
  }

  handleDelete(index: number, row: any): void {
    (this as any).$axios
      .delete(`/api/users/deleteUser/${row._id}`)
      .then((res: any) => {
        this.$message({
          message: "Success!",
          type: "success",
        });
        this.tableData.splice(index, 1);
      });
  }

  handleSave(index: number, row: any): void {
    row.edit = false;
    (this as any).$axios
      .post(`/api/users/editUser/${row._id}`, row)
      .then((res: any) => {
        this.$message({
          message: "Success!",
          type: "success",
        });
      });
  }

  selectChange(item: any) {
    this.options.map((option: any) => {
      if (option.role == item.role) {
        item.key = option.key;
        item.des = option.des;
      }
    });
  }

  getData() {
    (this as any).$axios("/api/users/allUsers").then((res: any) => {
      res.data.datas.forEach((item: any) => {
        item.edit = false;
      });
      this.tableData = res.data.datas;
    });
  }
}
</script>

<style lang="scss" scoped>
.account-data {
  height: 100%;
  overflow: auto;
  .add-box {
    margin-bottom: 10px;
  }
}
</style>
