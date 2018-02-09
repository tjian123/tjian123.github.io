(function($){
	var activeTag = $(".collapse-base:first");
	activeTag.removeClass("collapse-item-inactive");
	var activeArch = $("#archs >ul >li >a:first");
	activeArch.addClass("active-arch");

	$("#archs >ul >li >a").on("click", function(e) {
		var tag = $(this).attr("href");
		activeArch.toggleClass("active-arch");
		activeTag.toggleClass("collapse-item-inactive");
		activeArch = $(this);
		activeTag = $(tag);
		activeArch.toggleClass("active-arch");
		activeTag.toggleClass("collapse-item-inactive");
	});
})($);