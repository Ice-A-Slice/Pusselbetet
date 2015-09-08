// var bodyScroll;
// function initiateIScroll() {
//   $('body > *').not('.next').wrapAll($('<div />', {
//     id: 'wrapper',
//     css: {
//       width: $('body').width() + 'px',
//       height: $('body').height() + 'px',
//       position: 'absolute',
//       overflow: 'hidden'
//     }
//   }));
//   $('body').css({
//     width: $(window).width() + 'px',
//     height:  $(window).height() + 'px',
//     position: 'relative',
//     overflow: 'hidden'
//   });
//   bodyScroll = new IScroll('body', {
//     scrollX: true, 
//     scrollY: false,
//     mouseWheel: true,
//     scrollbars: false,
//     momentum: false,
//     click: true,
//     tap: true
//   });
// }