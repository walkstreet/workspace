<template>
    <div class="el-input__inner multi-select" :class="{active: isActive}">
        <ul class="label" v-show="value.length>0">
            <li v-for="(list,index) in value" @click="deleteData(index)">{{list.name}}</li>
        </ul>
        <div class="placeholder" v-if="placeholderIsShow" @click="placeholderOnClick">{{placeholder}}</div>
        <input type="text" placeholder="" v-model="inputWord" autocomplete="off" @focus="onFocus" @blur="onBlur" @keyup="keyUpCallBack" v-if="isShow" v-focus="focusStatus">
        <div class="list">
            <ul class="select-list" v-if="sList.length>0" ref="select">
                <li v-for="(list,index) in sList" @mouseover="hoverData(index)" :class="{'active':index==isSelect}" @click="selectData(index)">{{list.name}}</li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .multi-select{
        width:100%;
        display: tablel-cell;
        vertical-align: middle;
        font-size: 14px;
        cursor: text;
        min-height: 36px;
        height: auto;
        position: relative;
        input{
            display: inline-block;
            outline: none;
            border: none;
            height: 26px;
            max-width: 100%;
            min-width: 50%;
            vertical-align: middle;
        }
        .placeholder{
            color: #b3b8ca;
            line-height: 28px;
        }
        &.active{
            border: 1px solid #20a0ff;
        }
    }
    ul{
        margin:0;
        padding:0;
        li{
            margin:0;
            padding:0;
            list-style: none;
        }
    }
    ul.label{
        font-size: 0;
        display: inline-block;
        vertical-align: middle;
        li{
            font-size: 12px;
            margin: 2px 4px;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 2px;
            padding: 4px 8px;
            background-color: #f0f0f0;
            vertical-align: middle;
            cursor: pointer;
            &:hover{
                background-color: #aaaaaa;
            }
        }
    }
    .list{
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        z-index: 1000;
        ul.select-list{
            position: absolute;
            top: 0;
            width:100%;
            background-color: #fff;
            border: 1px solid #bfcbd9;
            border-radius: 4px;
            max-height: 232px;
            overflow-y: auto;
            li{
                line-height: 28px;
                font-size: 12px;
                padding: 0 10px;
                color: #999;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                &:hover{
                    background-color: #e7e7e7;
                    color: #666;
                }
                &.active{
                    background-color: #e7e7e7;
                    color: #666;
                }
            }
        }
    }
</style>
<script>
    module.exports = {
        props: ["value","selectList","placeholder"],
        data(){
            return {
                dataList: this.value,  // 组件的v-model值
                isActive: false,  // 获取焦点时激活的样式
                isShow: this.value.length > 0,  //输入框的显示隐藏布尔 
                focusStatus: false,  // 焦点获取的布尔判断
                placeholderIsShow: this.value.length == 0,  // placeholder的显示隐藏布尔
                sList: this.selectList,  // 组件传入的selectList的变量做一个中间过渡，否则无法直接处理props数据
                inputWord: "",  // 默认给输入框一个值
                isSelect: 0,  // 记录选择项的选中索引
                count: 0 // 计数器，主要记录如果按退格键，输入框无值，第二次就删掉已选标签
            }
        },
        ready(){
            this.sList = [];
        },
        mounted: function(){
            //点击空白处收起下拉选项
            var root = this;
            document.addEventListener('click', (e) => {
                if (!this.$el.contains(e.target)) root.sList = [];
            })
        },
        methods: {
            switchShow(boolem){  // 显示placeholder还是input的开关
                this.isShow = boolem;
                this.placeholderIsShow = !this.isShow;
                this.focusStatus = boolem;
            },
            placeholderOnClick(){  // placeholder点击后，placeholder隐藏，input显示
                this.switchShow(true);
            },
            onFocus(){  // 输入框获得焦点后
                this.isActive = true;
            },
            onBlur(){  // 输入框焦点失去
                this.isActive = false;
                if(this.value.length==0){
                    this.switchShow(false);
                }
                //清空输入框的值
                this.inputWord = "";
            },
            deleteData(index){  // 点击删除条目
                this.value.splice(index,1);
            },
            selectData(index){  // 选择条目
                //把选中的条目插入到value里
                let selected = this.sList[index];
                this.value.splice(this.value.length,0,selected);
                this.sList = [];
                //input清空
                this.inputWord = "";
            },
            keyUpCallBack($el){  // 判断是输入上、下，还是其他字母
                //如果是上，到到第一条后再按就跳转到最后一条
                if($el.keyCode == 38){
                    if(this.isSelect > 0){
                        this.isSelect--;
                        //往上判断选中的scroll事件
                        this.scrollMove('up');
                    }else if(this.isSelect == 0){
                        this.isSelect = this.sList.length-1;
                        //到最后一个时滚动条回到顶部
                        this.scrollMove('top');
                    }
                }
                //如果是下，到最后一条后再按就跳转到第一条
                else if($el.keyCode==40){
                    if(this.isSelect<this.sList.length-1){
                        this.isSelect++;
                        //往下判断选中的scroll事件
                        this.scrollMove('down');
                    }else if(this.isSelect == this.sList.length-1){
                        this.isSelect = 0;
                        //到最后一个时滚动条回到顶部
                        this.scrollMove('last');
                    }
                }
                //如果按了enter键后，就是选择
                else if($el.keyCode == 13){
                    this.selectData(this.isSelect);
                }
                //如果是退格，input框内有值的话就删除字符，如果没有字符但是有value的数组的话就删已选择的object
                else if($el.keyCode == 8){
                    if(this.inputWord.length == 0 && this.sList.length != 0){
                        this.sList = [];
                    }else if(this.inputWord.length == 0 && this.sList.length == 0 && this.value.length != 0){
                        this.value.splice(this.value.length-1,1);
                    }
                }
                //其他除了左、右的按键，
                else if($el.keyCode != 37 && $el.keyCode != 39){
                    this.count = 0;
                    this.$emit("keyUpCallBack",this.inputWord);
                    //默认选择始终是第一个
                    this.isSelect = 0;
                }
            },
            hoverData(index){  // 鼠标移至选择项时使该条数据样式激活css样式
                this.isSelect = index;
            },
            scrollMove(director){
                //下拉框的总高度
                let allHeight = this.$refs.select.scrollHeight;
                //可视高度
                let offsetHeight = this.$refs.select.clientHeight;
                //取当前激活的样式
                let active = this.$refs.select.querySelector(".active");
                let activeHeight = active.offsetHeight;
                let actvieOffsetTop = active.offsetTop + activeHeight;
                if(director == "down"){
                    //判断如果到当前可视区域的最后一个时就往下移动一条记录，直到最后到第一条
                    if( actvieOffsetTop > (offsetHeight-activeHeight) ){
                        this.$refs.select.scrollTop += activeHeight;
                    }
                }else if(director == "last"){
                    this.$refs.select.scrollTop = 0;
                }else if(director == "up"){
                    //判断如果到当前可视区域的最顶部的时候往上移动一条记录，直到第一条
                    if( actvieOffsetTop < this.$refs.select.scrollTop + activeHeight*2 ){
                        this.$refs.select.scrollTop = this.$refs.select.scrollTop - activeHeight;
                    }
                }else if(director == "top"){
                    this.$refs.select.scrollTop = allHeight - offsetHeight;
                }
            }
        },
        watch: {
            selectList: {  // 监听到新的传入的列表项时就赋值给中间变量sList
                handler: function(val,oldVal){
                    this.sList = val;
                }
            },
            value: {  // 监听v-model的值进行placeholder和input的切换
                handler: function(val,oldVal){
                    if(val.length == 0){
                        this.switchShow(false);
                    }else{
                        this.switchShow(true);
                    }
                }
            }
        },
        directives: {  // 自定义指令，在点击输入框的placeholder之后，input获得焦点，出入true或false
            focus: {
                inserted: function (el, {value}) {
                    if (value) {
                        el.focus();
                    }
                }
            }
        }
    }
</script>