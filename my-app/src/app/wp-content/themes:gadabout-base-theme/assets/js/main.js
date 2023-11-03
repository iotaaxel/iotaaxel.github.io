(function($) {
$(document).ready(function($) {

var hoverTimer;
var leaveTimer;


//Global Variables

var vpWidth;

//Global Functions

// Really basic check for the ios platform
// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Get the device pixel ratio
var ratio = window.devicePixelRatio || 1;

// Define the users device screen dimensions
var screen = {
  width : window.screen.width * ratio,
  height : window.screen.height * ratio
};

// iPhone X Detection
if (iOS && screen.width == 1125 && screen.height === 2436) {
	$('body').addClass('iphonex');
}

//iPhone X and insta
var ua = navigator.userAgent || navigator.vendor || window.opera;


function isRetinaDisplay() {
  if (window.matchMedia) {
      var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
      return (mq && mq.matches || (window.devicePixelRatio > 1)); 
  }
}


function viewport() {

  var e = window, a = 'inner';

  if (!('innerWidth' in window )) {

    a = 'client';
    e = document.documentElement || document.body;

  }

  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };

}


var sticky = false;
var stickyWidth;

function stickMe() {

  var scroll = $(window).scrollTop() + viewport().height;
  var scrollTop = $(window).scrollTop();
  

  $('.sticky').each(function() {

    if (scrollTop > $(this).parent().offset().top && scrollTop < $(this).parent().offset().top + $(this).parent().outerHeight()) {

      if (!$(this).hasClass('article-sidebar-inner')) {

        sticky = $(this);
        //sticky.parents('article').removeClass('first');
        stickyWidth = sticky.parent().outerWidth();
        //console.log(stickyWidth);

      }
      

    } 

  });

  if (sticky) {

    var stickyHeight = sticky.outerHeight();
    var par = sticky.parent();
    var parTop = par.offset().top;
    var parBot = parTop + par.outerHeight();
    var isFixed = $('.sticky.fixed').length;
    var parSticky = parTop + stickyHeight;
    var stickyTop = sticky.offset().top;

    $('.sticky').not(sticky).not($('.article-sidebar-inner')).removeClass('fixed');
    $('.sticky').not(sticky).not($('.article-sidebar-inner')).removeClass('fixed-top');

    if (stickyHeight > viewport().height) {

      if (scroll > parSticky && scroll < parBot) {

        sticky.addClass('fixed');
        sticky.removeClass('stuck');
        sticky.outerWidth(stickyWidth);

        console.log('fixed');

      } else if (scroll > parBot) {

        sticky.addClass('stuck');
        sticky.removeClass('fixed');
        sticky.outerWidth(stickyWidth);
        console.log('stuck');

      } else if (stickyTop < parTop && sticky.hasClass('fixed')) {
      
        sticky.removeClass('fixed');
        sticky.removeClass('stuck');
        sticky.removeAttr('style');
        console.log('none 1');

      } else {

        sticky.removeClass('fixed');
        sticky.removeClass('stuck');
        sticky.removeAttr('style');
        console.log('none 1');

      }

    } else {


      if (scrollTop > parTop && scrollTop < parBot - stickyHeight) {

        sticky.addClass('fixed-top');
        sticky.removeClass('stuck');
        sticky.outerWidth(stickyWidth);

      } else if (scrollTop > parBot - stickyHeight) {

        sticky.addClass('stuck');
        sticky.removeClass('fixed-top');
        sticky.outerWidth(stickyWidth);

      } else {

        sticky.removeClass('fixed-top');
        sticky.removeClass('stuck');
        sticky.removeAttr('style');

      }


    }

  }

}



function articleCheck() {

  var scrollTop = $(window).scrollTop();
  var scroll = scrollTop + (viewport().height / 2);
  var curArt = false;
  var scrollDiff = 0;

  $('article').each(function() {

    var thisHeight = $(this).outerHeight();
    var thisTop = $(this).offset().top;
    var thisBot = thisTop + thisHeight;

    if (scroll > thisTop && scroll < thisBot) {

      curArt = $(this).data('id');
      $(this).addClass('active').siblings().removeClass('active');
      scrollDiff = scroll - thisTop;
      scrollDiff = scrollDiff / thisHeight;
      scrollDiff = scrollDiff * 100;
      $('#article-' + curArt + ' .progress').height(scrollDiff + '%');

      if (curArt = 1) {

        $('#article-1 .hero-post-shop').addClass('active');

      } else {

        $('#article-1 .hero-post-shop').removeClass('active');

      }
      

    }

  });

}


function previousPostCheck() {

  $('.article-sidebar .previous-post').each(function() {

    var main = $(this).offset().top;
    var secondary = $(this).prev().offset().top + $(this).prev().outerHeight();
    var newText = '';

    if (main < secondary + 50) {

      newText = jQuery.trim($(this).find('span').text()).substring(0, 25)
                          .trim(this) + "...";
      $(this).find('span').text(newText);

    }

  });

}


//Functions on Load

$(window).on('load',function() {

  vpWidth = viewport().width;

  stickMe();
  //responsiveSlider();

  if ($('article').length) {

    articleCheck();

  }

  if ($('.previous-post').length) {

    previousPostCheck();

  }


});


//Functions on Resize

$(window).on('resize', function() {

 // responsiveSlider();

  if ($('.previous-post').length) {

    previousPostCheck();

  }
  

});


//Functions on Scroll
var lastScrollTop = 0;

$(window).scroll(function(event){

   var st = $(this).scrollTop();

   if (st < lastScrollTop){
       if (st > 250) {
        $('.article-sidebar-inner').addClass('drop');
      } else {
        $('.article-sidebar-inner').removeClass('drop');
      }
   } else {
      $('.article-sidebar-inner').removeClass('drop');
      
   }

   lastScrollTop = st;

});

$(window).on('scroll', function() {

  if (viewport().width > 960) {

    stickMe();


  } else {

    $('.fixed-top').removeClass('fixed-top');
    $('.stuck').removeClass('stuck');

  }

  if ($('article').length) {

    articleCheck();

  }


});

$(document.body).on('click', 'article .article-sidebar .comments-trigger' ,function(e){

  $('html, body').animate({
      scrollTop: $("article.active .comment-section").offset().top - 48
  }, 2000);

  $("article.active .comment-section .comment-toggle").click();

});






$('.mobile-shade').on('click', function() {

  $('.article-bar').removeClass('shopping');

});

$('.shop-person').on('click', function() {

  if (viewport().width >= 800) {

    var dat = $(this).data('id');
    $(this).addClass('active').siblings().removeClass('active');
    $('#colab-slider-' + dat).addClass('active').siblings().removeClass('active');

  }

});

$('.header-search input').bind('input', function(){

  if ($(this).val()) {

    $(this).parent().addClass('typing');

  } else {

    $(this).parent().removeClass('typing');

  }

});

$('.search-clear').on('click', function() {

  $(this).prev().val('');
  $(this).parent().removeClass('typing');

});

$('.show-text').on('click', function() {

  $(this).fadeOut().next().slideDown();

});

$(document.body).on('click', 'header .newsletter-trigger' ,function(e){
  $(this).toggleClass('active').siblings().removeClass('active');
  $(this).parents('.header-wrap').find('.header-form').toggleClass('active').siblings().removeClass('active');
  $(this).parents('.header-wrap').find('.header-form input').first().focus();
});

$(document.body).on('click', 'header .follow-trigger' ,function(e){
  $(this).toggleClass('active').siblings().removeClass('active');
  $(this).parents('.header-wrap').find('.header-follow').toggleClass('active').siblings().removeClass('active');
});

$(document.body).on('click', 'header .search-trigger' ,function(e){
  $(this).toggleClass('active').siblings().removeClass('active');
  $(this).parents('.header-wrap').find('.header-search').toggleClass('active').siblings().removeClass('active');
});


// $('header .follow-trigger, .header-follow').hover( 
//   function() {
//     $(this).addClass('active');
//     $(this).parents('.header-wrap').find('.header-follow').addClass('active');
//   }, function() {
//     $(this).removeClass('active');
//     $(this).parents('.header-wrap').find('.header-follow').removeClass('active');
//   }
// );

// $('header .search-trigger, .header-search').hover(
//   function() {
//     $(this).addClass('active');
//     $(this).parents('.header-wrap').find('.header-search').addClass('active');
//   }, function() {
//     $(this).removeClass('active');
//     $(this).parents('.header-wrap').find('.header-search').removeClass('active');
//   }
// );

$(document.body).on('click', 'header .search-toggle' ,function(e){

    $(this).parents('.header-wrap').find('.header-search').toggleClass('active');

});



$(document.body).on('click', '.previous-post' ,function(e){

  e.preventDefault();

  var dat = $('article.active').data('id') + 1;

  $('html, body').animate({
      scrollTop: $('#article-' + dat).offset().top
  }, 2000);

});

$(document.body).on('click', '.socials-trigger' ,function(e){

  $(this).prev().slideToggle();
  $(this).toggleClass('twist');
  $(this).parents('.article-sidebar-inner').find('.previous-post').toggleClass('hide');

});

// $(".whole-click").on( "click", function() {

//   var gotolink = $(this).find("a").attr("href");
//   window.location = gotolink;
  
// });










//*******************
//	Shop Single Check
//*******************
if($('body').hasClass('single-post'))
{
	
	$('p').each(function() {
	    var $this = $(this);
	    if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
	        $this.remove();
	});
}


//*******************
//	Shop Item Click
//*******************
$(document.body).on('click', '.shop-item .badge, .shop-article-item .badge, .worn-post.cta-post a.cta, .shop-ig-slider .slide .badge, .shop-worn-product .badge, .article-shop .badge, .hp-shop .badge, .product .badge' ,function(e){
	
	e.preventDefault();
	
	var $this = $(this);
 	
 	$this.after('<img src="/wp-content/themes/dam-2017/img/ajax-loader.gif" class="loader">'); 
 	social_showing = true;
 	
 	var data = {
		action: 'damsel_get_product_info',
		id: $(this).data('id')
	};
	
	$.post(ajaxurl, data, function(response)
	{  
		$('.shop-item img.loader, .shop-article-item img.loader, .worn-post.cta-post img.loader, .shop-ig-slider .slide img.loader, .shop-worn-product img.loader, .article-shop img.loader, .hp-shop img.loader, .product img.loader').remove();
		$('.shop-slideout-inner').html(response);
		
		$('.shop-slideout').addClass('open');

		setTimeout(function() {
      badgeCheck();
			$('.shop-slideout-inner').addClass('open');
		}, 300); 
		
	});
	
 	return false;
});



//*******************
//	Load More - Archive
//*******************
$('.archive-load-more').on('click', function() {
	
	var $this = $(this);
	
	$this.find('h2').html('Loading...');

	var data = {
		action: 'exsite_more_posts',
		data: $(this).data()
	};
	
	$.post(ajaxurl, data, function(response)
	{
		response = $.parseJSON(response);
		$this.data('exclude', response.exclude);
		$this.data('page', response.page);
		
		
		if($this.data('type') == 'product')
			$('.shop-grid .placeholder.before').before(response.content);	
		else if($this.data('type') == 'archive-qa')
			$('.interview-grid.last .placeholder.last').before(response.content);	
		else
			$('.post-grid-quarter.last').append(response.content);	
		
		if(response.content == '')
			$this.hide();	
		else
			$this.find('h2').html('Load More');
		
		
		if(response.next_count <= 0)
			$this.hide();
		
		$('img').each(function(){
			new RetinaImage(this);
		});
	    
	});

});


//*******************
//	Load More - HOME
//*******************

$('.load-more.home a').on('click', function(e) {
	
	e.preventDefault();
	
	var $this = $(this);
	var data = $this.data();
	data.exclude = $this.parent().parent().data('exclude');
	
	$this.html('LOADING...');

	var data = {
		action: 'exsite_more_posts',
		data: $(this).data()
	};
	
	$.post(ajaxurl, data, function(response)
	{
		response = $.parseJSON(response);
		$this.parent().parent().data('exclude', response.exclude);
		
		$('.hp-posts.archive').addClass('active');

		$('.post-grid-quarter.last').append(response.content);	
		
		if(response.content == '')
			$this.hide();	
		else
			$this.html('LOAD MORE');
		
		
		if(response.next_count <= 0)
			$this.hide();
		
		$('img').each(function(){
			new RetinaImage(this);
		});
	    
	});

});

//*******************
//	Scrolling Article
//*******************
if($('body').hasClass('single-post'))
{
	$('.archive-load-more').hide();
	
	var article = 1;
	var articles_loaded = [];
	var paged = 1;
	var check_for_change_post = 1;
	var counter_post = 0;
	
	
	$.fn.isOnScreen = function(){
	    
	    var win = $(window);
	    
	    var viewport = {
	        top : win.scrollTop(),
	        left : win.scrollLeft()
	    };
	   viewport.right = viewport.left + win.width();
	   viewport.bottom = viewport.top + win.height();
	  
	   var bounds = this.offset();
	   bounds.right = bounds.left + this.outerWidth();
	   bounds.bottom = bounds.top + this.outerHeight();
	    
	   return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
	    
	};
	
	
	
	$(window).scroll(function()
	{
		
		//Get Next Article
	    if ($('.articles .article-main:last').isOnScreen() == true)
	    {	  
				console.log($('.articles .next-article:last').data('next'))
		console.log(articles_loaded+'--')
		    if(!isInArray($('.articles .next-article:last').data('id'),articles_loaded) && $('.articles .next-article:last').data('next') !='')
		    {
			    $('.archive-load-more').show();
			    
			    articles_loaded.push($('.articles .next-article:last').data('id'));
			    $.get($('.articles .next-article:last').data('next-url'), function( next_post_loaded ){
				    
				    $('.archive-load-more').hide();
					
				    var article_contents = $(next_post_loaded).find("#article-1").html();
				    
				    var article_count = counter_post + 2;
				    article_contents = '<div id="article-'+article_count+'" data-id="'+article_count+'" class="row active">'+article_contents+'</div>';
					article_contents = article_contents.replace("data-article-count='1'", "data-article-count='"+article_count+"'");
					$('.articles').append(article_contents);
				    
				    counter_post++;

					
					previousPostCheck();
					
					
					
					
					/*setTimeout(function()
					{
						$('.article-sidebar .disqus-comment-count:contains("Comments")').each(function()						{
					    	$(this).html($(this).html().split("Comments").join(""));
						});
	
				    }, 500);*/
				    
				}, 'html');
			    
		    }
		}
		
		var curArt = getCurArt();
		;
		//URL Change
	    if(check_for_change_post != curArt)
	    {
		    check_for_change_post = curArt;
		    var post_url = $('#article-'+curArt+' .article-main').data('url');
		    var post_title = $('#article-'+curArt+' .article-main').data('title');
		    var post_id = $('#article-'+curArt+' .article-main').data('id');
		    
			if (history && history.pushState){
				if(typeof post_url != 'undefined')
				{
					document.title = post_title + " - Barefoot Blonde by Amber Fillerup Clark";
					history.pushState(null, post_title, post_url);
					current_article_url = post_url;

					counter_post++;
				}
			}
		}
	
	    
	});
	
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}
	
	
	function getCurArt() {

	  var scroll = $(window).scrollTop() + (viewport().height / 2);
	  var artTop;
	  var artBot;
	  var artId;
	  var nextArt;
	
	  $('.articles .row').each(function() {
	
	    $this = $(this);
	    artTop = $this.offset().top;
	    artBot = artTop + $this.outerHeight();
	    artId = $this.data('id');
	//console.log($this+'--')
	    if (scroll >= artTop && scroll < artBot) {
	
	      nextArt = artId;
	
	    }
	
	  });
	
	  return nextArt;
	
	}
}







function article1(step1, step2, scrollTime) {

  $('#article-1 .hero-post-shop').click();
  $('body').addClass('hide-stuff');

  setTimeout(function() {

    $('#article-1 .shop-expand').click();
    $('body').removeClass('hide-stuff');

    setTimeout(function() {

      $('html, body').animate({
        easing: 'linear',
        scrollTop: $('#article-1').outerHeight() - viewport().height + 145
      }, scrollTime);

    }, step2);

  }, step1);

}

function article2(scrollPixels, scrollTime) {

  $('html, body').animate({
    easing: 'linear',
    scrollTop: $(window).scrollTop() + scrollPixels
  }, scrollTime);

}


window.article1 = article1;
window.article2 = article2;

});
})(jQuery); 