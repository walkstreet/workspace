<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">欢迎页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <el-row class="section search">
                <el-col :span="6" class="search-col">
                    <label>角色名称</label>
                    <el-input v-model="input" placeholder="输入角色名称"></el-input>
                </el-col>
                <el-col :span="6" class="search-col">
                    <label>起始日期</label>
                    <el-date-picker
                        v-model="startDate"
                        type="date"
                        placeholder="请选择角色创建日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-col>
                <el-col :span="6" class="search-col">
                    <label>角色</label>
                    <el-date-picker
                        v-model="endDate"
                        type="date"
                        placeholder="请选择角色创建日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-col>
                <el-col :span="6" class="search-col">
                    <label>&nbsp;</label>
                    <el-button type="primary" @click="searchTable">查询</el-button>
                    <el-button>重置</el-button>
                </el-col>
                <!-- 自定义组件 -->
                <el-col :span="12" class="search-col">
                    <label>测试</label>
                    <select2 placeholder="请输入权限" v-model="roleList" :select-list="selectList" @keyUpCallBack="onKeyUp"></select2>
                </el-col>
                <!-- 自定义组件结束 -->
            </el-row>
            <div class="section">
                <div class="section-head">角色列表</div>
                <div class="section-action">
                    <el-button type="info">新增角色</el-button>
                    <el-button type="danger">批量删除</el-button>    
                </div>
                <div class="section-body">
                    <el-table
                        v-loading="false"
                        :data="tableData3"
                        border
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            label="日期"
                            width="120">
                            <template scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                            <template scope="scope">
                                <el-button @click="handleClick" type="text" size="small">查看</el-button>
                                <el-button type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[20, 50, 100]"
                        :page-size="20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400"
                        class="pagination">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import select2 from "../../component/select2";
module.exports = {
    data() {
        return {
            startDate: "",
            endDate: "",
            roleList: [
                
            ],
            selectList: [
                
            ],
            tableData3: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
        }
    },
    components: {
        'select2': select2
    },
    mounted(){

    },
    methods: {
        searchTable(){
            console.log(this.roleList);
        },
        onKeyUp(val){ //输入字符后的回调，可请求接口,val是输入框的值
            this.selectList = [];
            let count = 0;
            this.selectList.splice(this.selectList.length,1,
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                },
                {
                    id:count++,
                    name:"你好"
                }
            )
        }
    }
}
</script>