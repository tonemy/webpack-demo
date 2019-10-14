import 'layui-src/src/css/layui.css'
import 'layui-src/src/layui.js'
import '../css/userManage.css'

layui.use(['element', 'table', 'layer', 'form', 'layedit', 'laydate'], function(){
    let table = layui.table;
    let form = layui.form;
    let layedit = layui.layedit
        ,laydate = layui.laydate;
    let editIndex = layedit.build('LAY_demo_editor');

    // 获取用户信息
    table.render({
         elem: '#demo'
        ,id: 'demoTable'
        ,height: 812
        ,url:  'http://127.0.0.1:3000/mock/11/user/getUser'   //数据接口
        ,toolbar: '#toolbarDemo'
        ,limit: 10
        ,page: true
        ,cols: [[ //表头
            {field: 'id', title: 'ID', width:80, sort: true}
            ,{field: 'username', title: '用户名', width:100,  edit: 'text'}
            ,{field: 'ch_name', title: '区域用户', width:180}
            ,{field: 'password_hash', title: '密码', width:180}
            ,{field: 'email', title: '邮箱', width:180}
            ,{field: 'active', title: '是否激活', width: 120, templet: '#isActive', align: 'center'}
            ,{field: 'xzqhdm', title: 'xzqhdm', width: 100}
            ,{field: 'last_accessed_time', title: '最后登录时间', width: 180}
            ,{field: 'right', title: '操作', width: 200, toolbar: '#barDemo' }
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
        console.log(layEvent)
        if(layEvent === 'del'){
            layer.confirm('真的删除行么', function(index){
                 //删除对应行（tr）的DOM结构
                layer.close(index);
                //向服务端发送删除指令
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:3000/mock/11/user/delUser",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({id: index}),
                    success: function (res) {
                        if(res.code === 1) {
                            layer.msg("删除成功", {icon: 1});
                            obj.del();
                        }else {
                            layer.msg("删除失败", {icon: 2});
                        }
                    },
                    error: function (err) {
                        layer.msg("删除失败", {icon: 2});
                    }
                })
            });
        }else if(layEvent === 'edit'){
            EidtForm(data, obj);
        }
    });
    form.on('switch(switchTest)', function (obj) {
        let id = $(this).attr('switch_id');
        console.log(id);
        // 数据重载
        let isActive = obj.elem.active?true:false;
        $.ajax({
            url: 'http://127.0.0.1:3000/mock/11/actUser',
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify({"id": id, "active": isActive}),
            success: function (res) {
                if(res.code === 1) {
                    layer.msg("修改成功", {icon: 6});
                }else {
                    layer.msg("修改失败", {icon: 2});
                }
            },
            error: function () {
                layer.msg("修改失败", {icon: 2});
            }
        })

    });
    //表单修改的验证
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (value.trim().length < 6) {
                return '用户名长度不小于6个字符';
            }
        },
        ch_name: function (value, item) {
            if (value.trim().length <= 0) {
                return '区域用户名不能为空';
            }
        },
        password: function (value, item) {
            if (value.trim().length <= 0) {
                return '请输入密码';
            }
            if (value.trim().length <= 6) {
                return '密码长度至少为6位';
            }
        },
        email: function (value, item) {
            if (!RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$").test(value)) {
                return '请输入正确的邮箱格式';
            }
        }
    });

    //监听提交
    form.on('submit(demo1)', function(data){
        //ajax提交post请求后,重置表单数据,并隐藏
        $.ajax({
            url: 'http://127.0.0.1:3000/mock/11/user/putUser',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType : "JSON",
            data: JSON.stringify(data.field),
            success: function (res) {
                 if(res.code === 1) {
                    layer.msg("修改成功", {icon: 1});
                 }else {
                    layer.msg("修改失败", {icon: 2});
                 }
                // alert(res)
            },
            error: function (err) {
                layer.msg("修改失败", {icon: 2});
            }
        });
        return false;
    });

    function EidtForm(data, obj) {
        $("#id").val(data.id);
        $("#username").val(data.username);
        $("#ch_name").val(data.ch_name);
        $("#password").val(data.password_hash);
        $("#email").val(data.email);
        layer.open({
            type: 1,
            title: '编辑内容',
            area: ['500px', '420px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#layui-form'),
            cancel: function () {
                $("#layui-form").css("display","none");
            }
        });

    };

    $('#user_search').on('click', function () {
        // 搜索条件
        let send_name = $('#send_name').val();

        table.reload('demoTable', {
            where: {
                username: send_name,
            }
            , page: {
                curr: 1
            }
        });
    });

});