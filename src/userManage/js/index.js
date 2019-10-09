import 'layui-src/src/css/layui.css'
import 'layui-src/src/layui.js'
const data = require('../../../dist/data/demo.json')

layui.use(['element', 'table', 'layer'], function(){
    let table = layui.table;

    // 实例
    table.render({
         elem: '#demo'
        ,height: 812
        ,url:  '../../data/demo.json'   //数据接口
        ,toolbar: '#toolbarDemo'
        ,page: true //开启分页
        ,cols: [[ //表头
            {field: 'id', title: 'ID', width:80, sort: true}
            ,{field: 'username', title: '用户名', width:100,  edit: 'text'}
            ,{field: 'CH_username', title: '区域用户', width:180}
            ,{field: 'email', title: '邮箱', width:180}
            ,{field: 'active', title: 'XXX', width: 80}
            ,{field: 'xzqhdm', title: 'XXXXX', width: 80}
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
        $("#CH_username").val(data.CH_username);
        $("#email").val(data.email);
        $("#active").val(data.active);
        $("#xzqhdm").val(data.xzqhdm);

        layer.open({
            type: 1,
            title: '编辑内容',
            area: ['600px', '420px'],
            shadeClose: true, //点击遮罩关闭
            content: $('#layui-form')
        });
    }
});