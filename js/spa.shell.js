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

/*global $, spa */

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
      + '<div class="spa-shell-modal"></div>',
      chat_extend_time : 1000,
      chat_retract_time : 300,
      chat_extend_height : 450,
      chat_retract_height : 15,
      chat_extended_title : 'Click to retract',
      chat_retracted_title : 'Click to extend',
    },
    stateMap = { 
      $container        : null,
      is_chat_retracted : true 
    },
    jqueryMap = {},
    
    setJqueryMap, toggleChat , onClickChat, initModule;
    // ------ Module Scope variable End ------
    
    // ------ Utility Method Start ------
    // ------ Utility Method End ------
  
    // ------ DOM Method Start ------
      // DOM Method /setJqueryMap/ Start
      setJqueryMap = function() {
        var $container = stateMap.$container;
        
        jqueryMap = { 
          $container : $container,
          $chat : $container.find( '.spa-shell-chat' ) 
        };
      };
      // DOM Method /setJqueryMap/ End
      
      // DOM Method /toggleChat/ Start
      // Purpose : Chat slider open & close
      // Parameter :
      //    * do_extend - If it's true, open. false, close.
      //    * callback  - When animation terminate, execute callback function.
      // Status : stateMap.is_chat_retracted value set.
      //    * true  - Slider is retracted.
      //    * false - Slider is extended.
      // Setting : 
      //    * chat_extend_time, chat_retract_time
      //    * chat_extend_height, chat_retract_height
      // Return value : boolean
      //    * true  - Slider animation is executed.
      //    * false - Slider animation isn't executed.
      //
      toggleChat = function ( do_extend, callback ) {
        var
          px_chat_ht = jqueryMap.$chat.height(),
          is_open    = px_chat_ht === configMap.chat_extend_height,
          is_closed  = px_chat_ht === configMap.chat_retract_height,
          is_sliding = ! is_open && ! is_closed;
          
          if ( is_sliding ) { return false; }
          
          // Chatting slider extend start
          if ( do_extend ){
            jqueryMap.$chat.animate(
              { height : configMap.chat_extend_height },
              configMap.chat_extend_time,
              function(){
                jqueryMap.$chat.attr(
                  'title', configMap.chat_extended_title
                );
                
                stateMap.is_chat_retracted = false;
                if ( callback ) { callback( jqueryMap.$chat ); }
              }
            );
            
            return true;
          }
          // Chatting slider extend end
          
          // Chatting slider reduce start
          jqueryMap.$chat.animate(
            { height : configMap.chat_retract_height },
            configMap.chat_retract_time,
            function(){
              jqueryMap.$chat.attr(
                  'title', configMap.chat_extended_title
                );
                
                stateMap.is_chat_retracted = true;
              
              // Avoid competition condition
              if ( callback ) { callback( jqueryMap.$chat ); }
            }
          );
          
          return true;
          // Chatting slider reduce end
      };
      // DOM Method /toggleChat/ End
      
    // ------ DOM Method End ------
    
    // ------ Event Handler Start ------
    onClickChat = function ( event ) {
      toggleChat( stateMap.is_chat_retracted );
      return false;
    };
    // ------ Event Handler End ------
    
    // ------ Public Method Start ------
    // public method /initModule/ Start
    initModule = function ( $container ) {
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();
      
      // Chatting slider initialize and click handler binding
      stateMap.is_chat_retracted = true;
      jqueryMap.$chat
        .attr( 'title', configMap.chat_retracted_title )
        .click( onClickChat );
    };
    // public method /initModule/ End
    
    return { initModule : initModule };
    // ------ Public Method End ------
}());