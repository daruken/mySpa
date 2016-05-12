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
      anchor_schema_map : {
        chat : { open : true, closed : true }
      },
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
      chat_extend_time : 250,
      chat_retract_time : 300,
      chat_extend_height : 450,
      chat_retract_height : 15,
      chat_extended_title : 'Click to retract',
      chat_retracted_title : 'Click to extend',
    },
    stateMap = {
      $container        : null,
      anchor_map        : {},
      is_chat_retracted : true 
    },
    jqueryMap = {},
    copyAnchorMap, setJqueryMap, toggleChat, 
    changeAnchorPart, onHashchange,
    onClickChat, initModule;
    // ------ Module Scope variable End ------
    
    // ------ Utility Method Start ------
    // ------ Return to be saved copy of anchor map. So minimize to operate load ------ 
    copyAnchorMap = function(){
      return $.extend( true, {}, stateMap.anchor_map );
    };
    // ------ Utility Method End ------
  
    // DOM Method /changeAnchorPart/ Start
    // Purpose : Change part of URI anchor component
    // Parameter :
    //      * arg_map - The map to show portion of URI anchor
    // Return : boolean
    //      * true - Be changed the part of URI anchor
    //      * false - Be not changed the part of URI anchor
    // Action :
    
    changeAnchorPart = function ( arg_map ){
      var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;
        
        // Start operation to combine change point with anchor map
        KEYVAL:
        for ( key_name in arg_map  ){
          if ( arg_map.hasOwnProperty( key_name ) ){
            // 반복 과정 중 skip dependency key
            if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }
            
            // Update for independent key
            anchor_map_revise[key_name] = arg_map[key_name];
            
            // Update for response dependent key
            key_name_dep = '_' + key_name;
            if ( arg_map[key_name_dep] ){
              anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
            }
            else{
              delete anchor_map_revise[key_name_dep];
              delete anchor_map_revise['_s' + key_name_dep];
            }   
          }
        }
        // End operation to combine change point with anchor map
        
        // Try URI update. If fail operation, rollback. 
        try {
          $.uriAnchor.setAnchor( anchor_map_revise );
        }
        catch( error ){
          $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
          bool_return = false;
        }
        // End try URI update
        
        return bool_return;
    }
    // DOM Method /changeAnchorPart/ End
    
    
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
                  'title', configMap.chat_retracted_title
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
    // Event Handler /onHashchange/ Start
    onHashchange = function ( event ) {
      var
        anchor_map_previous = copyAnchorMap(),
        anchor_map_proposed,
        _s_chat_previous, s_chat_proposed,
        s_chat_proposed;
        
      // Try anchor parsing
      try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }        
      catch ( error ){
        $.uriAnchor.setAnchor( anchor_map_revise, null, true );
        return false;
      }
      stateMap.anchor_map = anchor_map_proposed;
      
      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;
      
      if ( ! anchor_map_previous 
        || _s_chat_previous !== _s_chat_proposed 
        ){
          s_chat_proposed = anchor_map_proposed.chat;
          
          switch ( s_chat_proposed ){
            case 'open' :
              toggleChat( true );
              break;
            case 'closed' :
              toggleChat( false );
              break;
            default : 
              toggleChat( false );
              delete anchor_map_proposed.chat;
              $.uriAnchor.setAnchor( anchor_map_proposed, null, true );  
          }
        }
          
      return false;
    }
    // Event Handler /onHashchange/ End
    // ------ Event Handler End ------
    
    // ------ Event Handler Start ------
    /*jslint unparam: true*/
    onClickChat = function ( event ) {
      changeAnchorPart({
        chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
      });
      
      return false;
    };
    /*jslint unparam: false*/
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
        
      $.uriAnchor.configModule({
        schema_map : configMap.anchor_schema_map
      });
      
      // Function module setting & initialize
      spa.chat.configModule( {} );
      spa.chat.initModule( jqueryMap.$chat );  
        
      $(window)
        .bind( 'hashchange', onHashchange )
        .trigger( 'hashchange' );
    };
    // public method /initModule/ End
    
    return { initModule : initModule };
    // ------ Public Method End ------
}());