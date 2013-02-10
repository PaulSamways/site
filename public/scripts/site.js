$(function() {
  var url = window.location.pathname.toLowerCase();
  if (url[url.length - 1] == "/") {
    url += "index";
  }
  $("#menu a").each(function() {
    $(this).removeClass("current");
    var href = $(this).attr("href");

    if (url.indexOf(href) == 0) {
      $(this).addClass("current");
    }
  });
});
