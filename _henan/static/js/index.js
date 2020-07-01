layui.use([], () => {
  $(".js-tab-btn").hover(function () {
    var tabIndex = $(this).index()

    // console.log(tabIndex)
    // $(this).toggleClass("hover");

    $('.js-tab').eq(tabIndex).show().siblings('.js-tab').hide()
  });

})



