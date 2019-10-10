import 'layui-src/src/css/layui.css'
import 'layui-src/src/layui.js'
import '../css/userManage.css'

layui.use(['element', 'table', 'layer', 'form', 'layedit', 'laydate'], function(){
    let table = layui.table;
    let form = layui.form;
    let layedit = layui.layedit
        ,laydate = layui.laydate;
    var editIndex = layedit.build('LAY_demo_editor');

    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
        },

    });

    //监听提交
    form.on('submit(demo1)', function(data){
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

    // 实例
    table.render({
         elem: '#demo',height: 812
        ,url:  'http://localhost:8080/admin/getUser'   //数据接口
        ,toolbar: '#toolbarDemo'
        ,limit: 10
        ,page: true

        ,cols: [[ //表头
            {field: 'id', title: 'ID', width:80, sort: true}
            ,{field: 'username', title: '用户名', width:100,  edit: 'text'}
            ,{field: 'ch_name', title: '区域用户', width:180}
            ,{field: 'password_hash', title: '密码', width:180}
            ,{field: 'email', title: '邮箱', width:180}
            ,{field: 'active', title: '是否激活', width: 80}
            ,{field: 'xzqhdm', title: 'xzqhdm', width: 80}
            ,{field: 'last_accessed_time', title: '最后登录时间', width: 180}
            ,{field: 'right', title: '操作', width: 200, toolbar: '#barDemo'}
        ]]

    });
   // 监听事件
    table.on('toolbar(test)', function(obj){
        let checkStatus = table.checkStatus(obj.config.id);
        if(obj.event == 'add') {

            layer.open({
                title:'增加成员',
                type:1,
                area:['400px','400px'],
                content:$("#layui-form")
            });
        }
    });


    //监听行工具事件
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        let data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'del'){
            layer.confirm('真的删除行么', function(index){
                obj.del(); //删除对应行（tr）的DOM结构
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if(layEvent === 'edit'){

            EidtForm(data, obj);
        }
    });

    function EidtForm(data, obj) {

        $("#username").val(data.username);
        $("#CH_username").val(data.ch_name);
        $("#password").val(data.password_hash);
        $("#email").val(data.email);



        layer.open({
            type: 1,
            title: '编辑内容',
            area: ['500px', '420px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#layui-form')
        });
        //ajax提交post请求后,重置表单数据,并隐藏

    };
    $('#user_search').on('click', function () {
        // 搜索条件
        let send_name = $('#send_name').val();

        table.reload('demo', {
            method: 'get'
            , where: {
                username: send_name,
            }
            , page: {
                curr: 1
            }
        });
    });

});