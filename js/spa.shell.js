/*
 * spa.shell.js
 * SPA Shell Module
 */

/*jslint          browser : true, continue : true,
devel  : true,    indent  : 2,    maxerr   : 50,
newcap : true,    nomen   : true, plusplus : true,
regexp : true,    sloppy  : true, vars     : false,
white  : true
*/

/* Global $, spa */

spa.shell = (function () {
  // ------ Module Scope variable Start ------
  var
    configMap = {
      main_html : String()
      + '<div class="spa-shell-head">'
        + '<div class="spa-shell-head-logo"></div>'
        + '<div class="spa-shell-head-acct"></div>'
        + '<div class="spa-shell-head-search"></div>'
      + '</div>'
      + '<div class="spa-shell-main">'
        + '<div class="spa-shell-main-nav"></div>'
        + '<div class="spa-shell-main-content"></div>'
      + '</div>'
      + '<div class="spa-shell-foot"></div>'
      + '<div class="spa-shell-chat"></div>'
      + '<div class="spa-shell-modal"></div>'
    },
    stateMap = { $container : null },
    jqueryMap = {},
    
    setJqueryMap, initModule;
    // ------ Module Scope variable End ------
    
    // ------ Utility Method Start ------
    // ------ Utility Method End ------
  
    // ------ DOM Method Start ------
      // DOM Method /setJqueryMap/ Start
      setJqueryMap = function() {
        var $container = stateMap.$container;
        jqueryMap = { $container : $container };
      };
      // DOM Method /setJqueryMap/ End
    // ------ DOM Method End ------
    
    // ------ Event Handler Start ------
    // ------ Event Handler End ------
    
    // ------ Public Method Start ------
    // public method /initModule/ Start
    initModule = function ( $container ) {
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();
    };
    // public method /initModule/ End
    
    return { initModule : initModule };
    // ------ Public Method End ------
}());