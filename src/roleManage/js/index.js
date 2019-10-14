import 'layui-src/src/css/layui.css'
import 'layui-src/src/layui.js'
layui.use(['element', 'table'], function(){
    let element = layui.element;
    let table = layui.table;
    table.render({
        elem: '#getAllRoles',
        limit: 20,
        url: 'http://127.0.0.1:3000/mock/11/role/getAll',
        page: true,
        toolbar: '#topbar',
        cols: [[
            {field: 'id', title: 'ID', width: 100, sort: true},
            {field: 'name', title: 'Name', width: 100},
            {field: 'description', title: 'Description', width: 120},
            {field: '', title: '操作', width: 150,toolbar: '#rightbar'},
        ]]
    })

    //…
});