jQuery(document).ready(function($){
	// Scripts go here

	// Fixed Nav Scroll

	var menuOffset = $('.instagrams').height();
	$(document).bind('ready scroll',function() {
		var docScroll = $(document).scrollTop();
		if(docScroll >= menuOffset) {
			$('#masthead').addClass('fixed');
			$('.masthead-spacer').show();
		} else {
			$('#masthead').removeClass('fixed');
			$('.masthead-spacer').hide();
		}
	});

	// Instagrams

	w = $('.instagrams-wrapper').find('a').length * 150;
	$('.instagrams-wrapper').css({
		marginLeft: -(w/2) + 'px'
	}).addClass('ready');

	// Quick Comments

	$('.quick-comment-link').click(function(e){
		e.preventDefault();
		$(this).parents('.entry-footer').next().slideToggle();
	});

	$('.mobile-comment-action').click(function(e){
		e.preventDefault();
		$(this).parent().next().slideToggle();
	});

	// Masonry

	var $container = $('.category-shop-grid');

	$container.imagesLoaded( function(){
	  $container.masonry({
		itemSelector : '.category-shop-grid-tile',
		columnWidth : '.grid-sizer',
		gutter : '.gutter-sizer'
	  });
	});

	// Lightboxes

	$('.lightbox-close').click(function(e){
		e.preventDefault();
		$('.lightbox-link').removeClass('active');
		$('.lightbox').fadeOut();
		$('#page').removeClass('blurred');
		$('html,body').css({'overflow':'auto'});
	});

	$('.lightbox').click(function(e){
		e.preventDefault();
		$('.lightbox-link').removeClass('active');
		$('.lightbox').fadeOut();
		$('#page').removeClass('blurred');
		$('html,body').css({'overflow':'auto'});
	});

	$(".lightbox-inner").click(function(e) {
		e.stopPropagation();
	});

	$('a.lightbox-link, li.lightbox-link a').click(function(e){
		e.preventDefault();

		that = this;

		// Incase one is already open

		if ($('.lightbox').is(':visible')) {
			$('.lightbox-link').removeClass('active');
			$('.lightbox:visible').fadeOut(function(){
				$(that).addClass('active');
				var href = $.attr(that, 'href');
				$(href).fadeIn();
			});
		} else {

			$(that).addClass('active');
			var href = $.attr(that, 'href');
			$(href).fadeIn();
			$('#page').addClass('blurred');
			$('html,body').css({'overflow':'hidden'});

		}
	});

	// Photo Grid
	$('#main').on('click', '.show-photo-grid', function(e){
		e.preventDefault();
		that = this;
		$article = $(that).parents('article');
		dataUrl = $(that).data('url');
		$article.find('.photo-grid').fadeIn(function(){

			//Event
			if(typeof __gaTracker !== "undefined" || typeof ga  !== "undefined") {
				var ga = typeof ga !== "undefined" ? ga : __gaTracker;
				ga('send', 'event', 'Pin Gallery', 'click', dataUrl);
			}

			var masonryOptions = {
				itemSelector : '.grid-image',
				columnWidth : '.grid-sizer',
				gutter : '.gutter-sizer'
			}

			var $container2 = $article.find('.photo-grid-container');

			if ($container2.hasClass('is-initialized')) {
				// Nothing
			} else {
				$container2.imagesLoaded( function(){
					$container2.masonry(masonryOptions);
					$container2.addClass('shown');
					$container2.addClass('is-initialized');
				});
			}
		});
		$('html,body').css({'overflow':'hidden'});
	});

	$('.photo-grid-close').click(function(e){
		e.preventDefault();
		$('.photo-grid').fadeOut();
		$('html,body').css({'overflow':'auto'});
	});

	// Paging Nav Hover

	var isiPad = navigator.userAgent.match(/iPad/i) != null;

	if (!isiPad) {
		$('.paging-nav a').hover(function(){
			$('.hover-cover').fadeToggle('slow');
		});
	}

	// Mobile Menu

	$('#toggle-menu').click(function(e){
		e.preventDefault();
		$('.mobile-menu').slideToggle();
	});

	$('html').on('touchstart', function(e) {
		$('.mobile-menu').slideUp();
	});

	$("#toggle-menu, .mobile-menu, .lightbox-close, .photo-grid-close").on('touchstart',function(e) {
		e.stopPropagation();
	});

	// Where I Shop

	firstImage = $('.sidebar-section.shop ul li:first-child a').data('image');
	$('#where-i-shop-image').attr('src', firstImage);

	$('.sidebar-section.shop ul li a').hover(function(){
		i = $(this).data('image');
		$('#where-i-shop-image').attr('src', i);
	});

	// Subscribe

	var $subscribeForm = $('#subscribe-form');

	if ( $subscribeForm.length > 0 ) {
		$('#subscribe-form-submit').click(function ( event ) {
			event.preventDefault();
			register($subscribeForm);
		});
	};

	// Infinite Scroll

	$('#main').infinitescroll({
		loading: {
			selector: '.infinite-scroll-loading',
			msgText: 'Loading',
			img: templateDir + '/images/gif-load.gif',
			finishedMsg: "No More Posts",
			finished: function(obj){
				if (obj.state.isDone == true) {
					$('.load-more-link').text('No More Posts');
				} else {
					$('.load-more-link').text('Continue Reading');
				}
				$(window).lazyLoadXT();
				videoResponsiveRation();
			}
		},
		navSelector  : ".post-navigation",
		nextSelector : ".post-navigation a:first",
		itemSelector : "article",
		errorCallback: function(obj) {
			if (obj == 'done') {
				$('.load-more-link').text('No More Posts');
			}
		}
	},
	function(newElements, data, url) {
		// Swap out footer hover image
		$currid = $(newElements).last().data('id');
		var data = {
			 "action": "add_getnext",
			 "id":$currid
		};

		$.post(ajaxurl, data,
			function(data){
				$('.hover-cover').css('background-image', 'url('+data+')');
			}
		);
		url = url.replace(/^.*\/\/[^\/]+/, '');

		if(typeof __gaTracker !== "undefined" || typeof ga  !== "undefined") {
			var ga = typeof ga !== "undefined" ? ga : __gaTracker;
			ga('send', 'pageview', url);
		}


		//_gaq.push(['_trackPageview'], url);
		history.pushState({}, '', url);
	});

	currentPage = 1;
	$('.category-grid').infinitescroll({
		loading: {
			selector: '.infinite-scroll-loading',
			msgText: 'Loading',
			img: templateDir + '/images/gif-load.gif',
			finishedMsg: "No More Posts"
		},
		navSelector  : ".post-navigation",
		nextSelector : ".post-navigation a:first",
		itemSelector : ".category-grid-item",
		debug        : true,
		path: function(pageNumber) {
			var address = window.location.href.split('page/');
			var finalPath = address[0];
			if(address[1]) {
				var actualPage = parseInt(address[1].replace('/',''), 10);
				var nextPage = actualPage + 1;
			} else {
				if(address.indexOf('archives') !== -1) {
					var nextPage = pageNumber + 1;
				} else {
					var nextPage = pageNumber;
				}
			}
			var final = finalPath + 'page/' + nextPage + '/';
			history.pushState(null, '', final);
			return final;
		},
		callback: function() {
		}
	},
	function(newElements, data, url) {
		url = url.replace(/^.*\/\/[^\/]+/, '');

		if(typeof __gaTracker !== "undefined" || typeof ga  !== "undefined") {
			var ga = typeof ga !== "undefined" ? ga : __gaTracker;
			console.log(url);
			ga('send', 'pageview', url);
		}
	});


	$(window).unbind('.infscr');

	$('#load-more-posts').click(function(e){
		e.preventDefault();
		$('.category-grid').infinitescroll('retrieve');
	});

	$('.load-more-link').click(function(e){
		e.preventDefault();
		$(this).text('Loading...');
		$('.infinite-scroll-loading').hide();
		$('#main').infinitescroll('retrieve');
	});

	//Related events
	$('.wp_rp_content li').click(function() {
		var $this = $(this);
		var dataUrl = $this.find('a').attr('href');
		var pos = $this.find('a').data('position');
		if(typeof __gaTracker !== "undefined" || typeof ga  !== "undefined") {
			var ga = typeof ga !== "undefined" ? ga : __gaTracker;
			ga('send', 'event', 'More Reader', 'click', dataUrl, pos);
		}

	});

	// FAQ

	$('.question').click(function(e){
		e.preventDefault();
		$(this).toggleClass('open');
		$(this).siblings('.answer').slideToggle();
	});

	$('.faq:first-child .question').trigger('click');

	// Timeago

	$('.timeago').timeago();

	//Video Ratio
	videoResponsiveRation();

	// Auto Opens

	if ( window.location.hash ) {
		// Open the Lightbox

		var href = window.location.hash;

		// Check if the el exists
		if ( $(href).length && $(href).hasClass('lightbox') ) {
			$(href).fadeIn();
			$('#page').addClass('blurred');
			$('html,body').css({'overflow':'hidden'});
		}
	}

	function videoResponsiveRation() {
		// Find all YouTube and Vimeo videos
			var $allVideos = $("iframe[src*='youtube.com'], iframe[src*='vimeo.com']"),

				// The element that is fluid width
				$fluidEl = $(".entry-content");

			// Figure out and save aspect ratio for each video
			$allVideos.each(function() {

			  $(this)
				.data('aspectRatio', this.height / this.width)

				// and remove the hard coded width/height
				.removeAttr('height')
				.removeAttr('width');

			});

			// When the window is resized
			$(window).resize(function() {

			  var newWidth = $fluidEl.width();

			  // Resize all videos according to their own aspect ratio
			  $allVideos.each(function() {

				var $el = $(this);
				$el
				  .width(newWidth)
				  .height(newWidth * $el.data('aspectRatio'));

			  });

			// Kick off one resize to fix all videos on page load
			}).resize();
	}

});

function register($form) {
	jQuery.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize(),
		cache       : false,
		dataType    : 'json',
		contentType: "application/json; charset=utf-8",
		error       : function(err) { console.log(err) },
		success     : function(data) {
			if (data.result != "success") {
				// Something went wrong, do something to notify the user. maybe alert(data.msg);
				alert(data.msg.replace("0 - ", ""));
				jQuery('#subscribe-form input[type="text"],#subscribe-form input[type="email"]').val("");
			} else {
				// It worked, carry on...
				jQuery('#subscribe-form input[type="text"]').val("").attr("placeholder", "Thank you!");
				jQuery('#subscribe-form input[type="email"]').val("").attr("placeholder", "Check your Email!");
				setTimeout(function(){
					jQuery('.lightbox').trigger('click');
				}, 3000);
			}
		}
	});
}

function fbShare(url, winWidth, winHeight) {
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('http://www.facebook.com/sharer.php?u=' + url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}

function twitterShare(url, winWidth, winHeight) {
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('http://twitter.com/share?url=' + url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}

function gPlusShare(url, winWidth, winHeight) {
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('https://plus.google.com/share?url=' + url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}


jQuery(window).on('load', function(){
     hch = jQuery('.paging-nav').outerHeight() + jQuery('.footer-instagrams').outerHeight();
	jQuery('.hover-cover').height(hch);

});
