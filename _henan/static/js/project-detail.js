layui.use([
  'layer'
  , 'laytpl'
], () => {

  // 1) 引入模块与声明常量 ====
  const layer = layui.layer
  let laytpl = layui.laytpl

  const url = commonURL + "/PMSoft.AjaxHttpHandler.ExamDetails.ashx"

  // 2) 注册事件 ====
  /**
   * @Deprecated
   * @param videoUrl
   */
  const handleJPlayerVideo = (videoUrl) => {
    // @demo
    // videoUrl = "http://active.pmddw.com/active/jp/792786/基础阶段漫游视频.mp4"

    // 显示视频模块
    // $('.projectDetail_video').show()

    $("#jquery_jplayer_1").jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
          // m4v: "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
          // m4v: "http://video.bimjs.com/pmss/wxllianggegongchenghebingchengyige%20.mp4",
          m4v: videoUrl,
          // poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png"
        }).jPlayer("play");
      },
      // swfPath: "/assets/plus/jplayer/dist/jplayer",
      supplied: "webmv, ogv, m4v",
      size: {
        width: "100%",
        height: "638px",
        // cssClass: "jp-video-270p"
      },
      useStateClassSkin: true,
      autoBlur: false,
      smoothPlayBar: true,
      keyEnabled: true,
      remainingDuration: true,
      toggleDuration: true
    });
  }

  const renderInfo = (data = {}) => {
    laytpl($("#tpl_info").html()).render(data, function (html) {
      $('#view_info').html(html);
    });
  }

  // 3) 初始化 ====
  const id = getUrlParam("id")
  if (id != null) {
    $.ajax({
      url: url,
      type: "GET",
      dataType: 'text',
      crossDomain: true == !(document.all),
      data: {
        guid: id,
      },
      success: function (res) {
        // const resp = res
        const resp = JSON.parse(res)
        if (resp && resp.result) {
          renderInfo(resp)
          // handleJPlayerVideo(resp.video[0].EA_AttachPath)
        } else {
          layer.alert(resp.msg)
        }
      },
      error: function (res) {
        console.log(res)
      }
    })
  }

});
