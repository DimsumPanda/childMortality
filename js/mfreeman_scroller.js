
/**
 * scroller - handles the details
 * of figuring out which section
 * the user is currently scrolled
 * to.
 *
 */
function scroller() {
  var windowHeight;
  var container_scrolly = d3.select('div.container_scrolly');

  // Set height
  var height = $('.step_scrolly:last').height()
  var marginBottom = parseInt($('.step_scrolly:last').css('margin-bottom'))
  var newHeight = $(window).height() - height - marginBottom
  $('.step_scrolly:last').height(newHeight)
  console.log('height ', height, ' new height ', newHeight)
  // event dispatcher
  var dispatch = d3.dispatch("active", "progress");

  // d3 selection of all the
  // text sections_scrolly that will
  // be scrolled through
  var sections_scrolly = null;

  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  var sectionPosition_scrollys = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;

  /**
   * scroll - constructor function.
   * Sets up scroller to monitor
   * scrolling of els selection.
   *
   * @param els - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  function scroll(els) {
    sections_scrolly = els;
    // when window is scrolled call
    // position_scrolly. When it is resized
    // call resize.
    d3.select(window)
      .on("scroll.scroller", position_scrolly)
      .on("resize.scroller", resize_scrolly);

    // manually call resize
    // initially to setup
    // scroller.
    resize_scrolly();

    // hack to get position_scrolly
    // to be called once for
    // the scroll position_scrolly on
    // load.
    d3.timer(function() {
      position_scrolly();
      return true;
    });
  }

  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPosition_scrollys
   *
   */
  function resize_scrolly() {
    // sectionPosition_scrollys will be each sections_scrolly
    // starting position_scrolly relative to the top
    // of the first section.
    sectionPosition_scrollys = [];
    var startPos;
    sections_scrolly.each(function(d,i) {
      var top = this.getBoundingClientRect().top;
      if(i === 0) {
        startPos = top;
      }
      sectionPosition_scrollys.push(top - startPos);
    });
    containerStart = container_scrolly.node().getBoundingClientRect().top + window.pageYOffset;
  }

  /**
   * position_scrolly - get current users position_scrolly.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */
  function position_scrolly() {
    var pos = window.pageYOffset - 10 - containerStart;
    var sectionIndex = d3.bisect(sectionPosition_scrollys, pos);
    sectionIndex = Math.min(sections_scrolly.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      dispatch.active(sectionIndex);
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPosition_scrollys[prevIndex];
    var progress = (pos - prevTop) / (sectionPosition_scrollys[sectionIndex] - prevTop);
    dispatch.progress(currentIndex, progress);
  }

  /**
   * container - get/set the parent element
   * of the sections_scrolly. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
  scroll.container_scrolly = function(value) {
    if (arguments.length === 0) {
      return container_scrolly;
    }
    container_scrolly = value;
    return scroll;
  };

  // Update function
  scroll.update = function(action) {
    if (arguments.length === 0) {
      return update;
    }
    scroll.on('active', function(index) {
      // highlight current step text
      d3.selectAll('.step_scrolly')
        .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });
      action(index)
  });
    return scroll;
  };

  // 

  // allows us to bind to scroller events
  // which will interally be handled by
  // the dispatcher.
  d3.rebind(scroll, dispatch, "on");

  return scroll;
}


