
layui.use([
  'layer'
  // , 'form'
  , 'laypage'
  , 'laytpl'
], () => {

  // 1) 引入模块与声明常量 ====
  const layer = layui.layer
  let laypage = layui.laypage
  let laytpl = layui.laytpl

  const url = commonURL + '/PMSoft.AjaxHttpHandler.ExamTest.ashx'
  // const url = '/json/mock.json'

  var pagination = {
    curr: 1,
    limit: 10,
  }

  // 2) 注册事件 ====
  const renderPagination = (totalNum = 0) => {
    // 初始化
    // 分页渲染
    laypage.render({
      elem: 'details_pagination' // ID，不用加 # 号
      , count: totalNum // 数据总数，从服务端得到
      , limit: pagination.limit
      , curr: pagination.curr
      , jump: (pager, isFirst) => {

        // 首次不执行
        if (!isFirst) {
          // console.log(pagination)
          pagination = pager
          fetchList()
        }

      }
    });
  }

  const renderList = (list = []) => {
    laytpl($("#tpl_list").html()).render(list, function (html) {
      $('#view_list').html(html);
    });
  }

  const fetchList = () => {

    jQuery.support.cors = true;
    $.ajax({
      url: url,
      type: "GET",
      dataType: 'text',
      // responseType: 'json',
      // dataType:"jsonp",
      // “...”目前babel版本不支持
      // @fix https://blog.csdn.net/sinat_38818576/article/details/102854448
      crossDomain: true == !(document.all),
      data: {
        sPageIndex: pagination.curr,
        sPageSize: pagination.limit,
        keywords: $.trim($('#keywords_input').val()),
      },
      success: function (res) {
        // const resp = res
        const resp = JSON.parse(res)

        if (resp && resp.result) {
          renderList(resp.data)
          renderPagination(resp.totalNum)
        } else {
          layer.msg(resp.msg)
        }

      },
      error: function (res) {
        console.log(res)

      }
    })

  }

  const handleSearch = () => {
    $('#search_btn').on('click', () => {
      resetPagination()

      fetchList()
    })
  }

  const resetPagination = () => {
    pagination = {
      curr: 1,
      limit: 10,
    }
  }

  // 3) 初始化 ====
  // 获取列表
  fetchList()

  // 注册搜索事件
  handleSearch()

});
