<template>
  <div class="table-data">
    <div class="search-box">
      <el-input
        size="small"
        v-model="searchVal"
        placeholder="plz enter class name to search"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
        >search</el-button
      >
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :height="tHeight"
      class="table-box"
    >
      <el-table-column type="index" label="index" width="60"></el-table-column>
      <el-table-column label="class name" prop="title"></el-table-column>
      <el-table-column
        width="120"
        label="class level"
        prop="level"
      ></el-table-column>
      <el-table-column
        width="120"
        label="subject"
        prop="type"
      ></el-table-column>
      <el-table-column
        width="120"
        label="registor total"
        prop="count"
      ></el-table-column>
      <el-table-column
        width="160"
        label="release date"
        prop="date"
      ></el-table-column>
      <el-table-column
        v-if="getUser.key != 'visitor'"
        label="action"
        width="160"
      >
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="mini"
            >edit</el-button
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
    <div class="pages" ref="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20]"
        :page-size="size"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </div>
    <EditDialog
      :dialogVisible="dialogVisible"
      :form="formData"
      @closeDialog="closeDialog"
    ></EditDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import EditDialog from "./EditDialog.vue";
@Component({
  components: { EditDialog },
})
export default class TableData extends Vue {
  @Getter("user") getUser: any;

  @Provide() searchVal: string = "";
  @Provide() tHeight: number = document.body.offsetHeight - 270;
  @Provide() tableData: any = [];
  @Provide() page: number = 1;
  @Provide() size: number = 5;
  @Provide() total: number = 0;

  @Provide() dialogVisible: Boolean = false;
  @Provide() formData: object = {
    title: "",
    type: "",
    level: "",
    count: "",
    date: "",
  };

  handleEdit(index: number, row: any) {
    this.formData = row;
    this.dialogVisible = true;
  }

  handleDelete(index: number, row: any) {
    console.log(row._id);
    (this as any).$axios
      .delete(`/api/profiles/delete/${row._id}`)
      .then((res: any) => {
        this.$message({
          message: "Success!",
          type: "success",
        });

        this.tableData.splice(index, 1);
      });
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  created() {
    this.loadData();
  }

  loadData() {
    (this as any)
      .$axios(`/api/profiles/loadMore/${this.page}/${this.size}`)
      .then((res: any) => {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      });
  }

  handleSizeChange(val: number): void {
    this.size = val;
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  handleCurrentChange(val: number): void {
    this.page = val;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  handleSearch(): void {
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  loadSearchData() {
    (this as any)
      .$axios(
        `/api/profiles/search/${this.searchVal}/${this.page}/${this.size}`
      )
      .then((res: any) => {
        this.tableData = res.data.datas.list;
        this.total = res.data.datas.total;
      });
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 14px;
  }
  .pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 55px;
    box-sizing: border-box;
  }
  .search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 55px;
    box-sizing: border-box;
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>
