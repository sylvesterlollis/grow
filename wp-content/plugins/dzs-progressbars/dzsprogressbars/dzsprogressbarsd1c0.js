// DZS Progress Bars
// @version 1.22
// @this is not free software
// @copyright - http://digitalzoomstudio.net


"use strict";

window.dzsprg_self_options = {};

(function($){

  $.fn.progressbars = function(o) {

    var defaults = {
      animation_time: "2000"
      ,maxperc: "100"
      ,initial_perc: "0"
      ,maxnr: "100"
      ,initon: "scroll"
      ,transition_text: "none"
      ,transition_text_anim_time: 300
      ,start_delay: "0"
      ,thousand_separate_character: ""
      ,settings_makeFunctional: false
      ,decimals: 'auto'
    };

    if(typeof o =='undefined'){
      if(typeof $(this).attr('data-options')!='undefined'  && $(this).attr('data-options')!=''){
        var aux = $(this).attr('data-options');
        aux = 'window.dzsprg_self_options = ' + aux;
        eval(aux);
        o = $.extend({},window.dzsprg_self_options);
        window.dzsprg_self_options = $.extend({},{});
      }
    }


    o = $.extend(defaults, o);
    this.each(function(){

      var cthis = $(this);
      var cthis_animprops = {};

      var started = false
        ,finished = false
      ;

      var initon='init';

      var startTime = 0
        ,totalAnimTime = 2000
        ,maxperc = 100
        ,maxnr = 700
      ;

      var i=0
        ,i29 = 0
      ;

      var _cach_temp_str = ''
        ,_cach_final_str = ''
      ;

      var inter_debug_func = 0
      ;

      var circle_vars = ['circle_outer_width', 'circle_outside_fill', 'circle_line_width', 'circle_inside_fill'];

      //--temp vars
      var _cnv = null;
      var _cnv_ctx = null;

      var finalhex = '';
      var sw_stop_enter_frame = false;

      var _w = $(window);

      var final_text = '';

      var inter_final_transition_text = 0;


      var text_transition_pending_arr = [];
      var text_transition_pending_left = 1000; // -- the number of transitions that need to be made before the new digit can be appended
      var text_transition_pending_done = 0; // -- the number of appends done to the transition con

//            console.info(cthis);


      // -- here we set @cthis_animprops from default props
      if(cthis.attr('data-animprops')!='' && typeof cthis.attr('data-animprops')!='undefined'){
        cthis_animprops = JSON.parse(cthis.attr('data-animprops'));
      }
      cthis_animprops = $.extend(o, cthis_animprops);
      // -- animprops set here
      // console.info('cthis_animprops - ', cthis_animprops);



      if(typeof cthis_animprops.maxperc!='undefined'){
        if(String(cthis_animprops.maxperc).indexOf('{{arg')>-1){
          var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
          var auxa = regex_getdef.exec(String(cthis_animprops.maxperc));
          if(auxa){
            if(typeof auxa[2]!='undefined'){
              maxperc = Number(auxa[2]);
            }
          }
//                    console.info(regex_getdef, auxa, cthis_animprops,auxa[3])
        }else{
          maxperc=cthis_animprops.maxperc;
        }

        if(isNaN(maxperc)){
          maxperc=100;
        }
      }
      // -- end .. maxperc was set




      console.log('cthis_animprops.decimals - ',cthis_animprops.decimals);
      if(typeof cthis_animprops.decimals!='undefined'){

        if(cthis_animprops.decimals == 'auto'){


          console.info('maxperc - ',maxperc);

          if(String(maxperc).indexOf('.')>-1){

            var auxarr = maxperc.split('.');

            o.decimals = auxarr[1].length;
            cthis_animprops.decimals = auxarr[1].length;
          }

        }
      }
      console.info('cthis_animprops.decimals final - ',cthis_animprops.decimals);


      if(typeof cthis_animprops.decimals!='undefined' && cthis_animprops.decimals == 'auto'){
        cthis_animprops.decimals = 0;
      }else{
        cthis_animprops.decimals = Number(cthis_animprops.decimals);
        if(isNaN(cthis_animprops.decimals)){
          o.decimals = 0;
          cthis_animprops.decimals = 0;
        }
      }
      // console.info('o.decimals final - ',o.decimals);


      if(typeof cthis_animprops.maxnr!='undefined'){
        if(String(cthis_animprops.maxnr).indexOf('{{arg')>-1){
          var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
          var auxa = regex_getdef.exec(String(cthis_animprops.maxnr));
          if(auxa){
            if(typeof auxa[2]!='undefined'){
              maxnr = Number(auxa[2]);
            }
          }
//                    console.info(regex_getdef, auxa, cthis_animprops,auxa[2])
        }else{
          maxnr=cthis_animprops.maxnr;
        }

        if(isNaN(maxnr)){
          maxnr=100;
        }
      }
      if(typeof cthis_animprops.maxnr!='undefined'){
        if(String(cthis_animprops.animation_time).indexOf('{{arg')>-1){
          var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
          var auxa = regex_getdef.exec(String(cthis_animprops.animation_time));
          if(auxa){
            if(typeof auxa[2]!='undefined'){
              cthis_animprops.animation_time = Number(auxa[2]);
            }
          }
//                    console.info(regex_getdef, auxa, cthis_animprops,auxa[2])
        }else{
          //cthis_animprops.animation_time=cthis_animprops.animation_time;
        }

        if(isNaN(cthis_animprops.animation_time)){
          cthis_animprops.animation_time=2000;
        }


      }




      for(var olab in cthis_animprops){



        var val = cthis_animprops[olab];


        if(String(val).indexOf('{{arg')>-1) {
          var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
          var auxa = regex_getdef.exec(String(val));
          if (auxa) {
            if (auxa[2]) {
              cthis_animprops[olab] = (auxa[2]);
            }
          }


        }
      }



//            console.info(maxnr);
      if(typeof cthis_animprops.initon!='undefined'){
        initon=cthis_animprops.initon;
      }
      if(typeof cthis_animprops.animation_time!='undefined'){
        totalAnimTime=cthis_animprops.animation_time;
      }
      cthis_animprops.initial_perc = Number(cthis_animprops.initial_perc);
      cthis_animprops.start_delay = Number(cthis_animprops.start_delay);

      var debug_var = true;
//            console.info(cthis, cthis.attr('data-animprops'));
//            console.log(JSON.parse(cthis.attr('animprops')));


      //console.info('init()');
      if(cthis.hasClass('inited')){
        return;
      }


      cthis.addClass('inited');

      handle_resize();
      reinit({
        'call_from':'init'
      });


      cthis.get(0).api_restart_and_reinit = function(){
        console.info('api_restart_and_reinit()');
        started = false;
        finished = false;
        startTime = new Date().getTime();

        cthis.find('.repeater-item:not(.repeater-item--sample)').remove();

        reinit({
          'call_from':'api'
        });
      };




      function start_it(){
        //console.info('startit() - ', started, cthis);
        if(started){
          return;
        }


        cthis.get(0).api_destroy_listeners = destroy_listeners;
        cthis.get(0).api_handle_resize = handle_resize;


        startTime = new Date().getTime();
        handle_frame();
        inter_debug_func = setInterval(debug_func, 1000);

        cthis.addClass('transition-text-'+o.transition_text);


        if(o.transition_text!='none'){
          if(o.transition_text_anim_time!=300){
            $('head').append('<style class="dzsprg-extra-style">.dzsprg-digit-con .dzsprg-digit{ transition-duration: '+(o.transition_text_anim_time/1000)+'s!important; } </style>');
          }
        }



        cthis.find('.text-progress-fill').each(function(){
          var _t = $(this);



          var _ttext = _t.text();



          _t.css('display','inline-block');
          var texth = _t.outerHeight();
          var textw = _t.width();
          _t.css('display','');

          // console.info('textw - ',$.textMetrics(_t));


          // {"width":"{{perc}}"}

          _t.wrapInner('<div class="text-progress-fill--text"></div>');

          // font-size="80"
          // _t.wrapInner('<div class="text-progress-fill--text"><svg width="'+textw+'" height="'+texth+'" viewBox="0 0 '+textw+' '+texth+'"><text y="0" x="0" ></text></svg></div>');

          _t.append('<div class="progress-bar-item text-progress-fill--inner"  data-animprops=\'{"width":"{{perc}}"}\' style="">'+_ttext+'</div>');
        })




        _w.on('resize.dzsprg', handle_resize);
        handle_resize();

        setTimeout(function(){

          handle_resize();
        },500);

        setTimeout(function(){

          handle_resize();
        },1000);
        setTimeout(function(){

          cthis.addClass('started');
        },10);
        started=true;
      }

      function destroy_listeners(){

        //console.info('DESTROY LISTENERS');

        _w.off('resize.dzsprg');
        clearInterval(inter_debug_func);
        sw_stop_enter_frame = true;
      }

      function handle_scroll(e){
        var windowh = _w.scrollTop() + _w.height();

        if(windowh>=cthis.offset().top+30){
          _w.unbind('scroll', handle_scroll);

          if(cthis_animprops.start_delay==0){
            start_it();
          }else{
            setTimeout(start_it, cthis_animprops.start_delay);
          }

        }
      }

      function reinit(pargs){


        var margs = {
          'call_from':'default'
        }

        if(pargs){
          margs = $.extend(margs,pargs);
        }

        cthis.find('.progress-bar-item').each(function(){
          var _t = $(this);
          var drawcircle = false;
          var textisvar = false;
          var animprops = {};
          //console.info(_t, _t.attr('data-animprops'));


          var thtml = _t.html();

          if(_t.hasClass('progress-bar-item--text')){

            var searched_string = '';

            searched_string = _t.html();


            if(_t.attr('data-initial-text' )){
              searched_string = _t.data('data-initial-text' );
            }

            if( ( searched_string.indexOf('{{') > -1 && String(searched_string).indexOf('}}')>-1)   ){
              textisvar = true;


              if(_t.attr('data-initial-text')){

              }else{

                _t.attr('data-initial-text', _t.html());
                _t.data('data-initial-text', _t.html());
              }







              if(String(thtml).indexOf('{{maxnr}}')>-1){

                // console.warn('thtml -- ',thtml,cthis_animprops.maxnr);
                thtml  = String(thtml).replace(/{{maxnr}}/g,cthis_animprops.maxnr);

                // console.warn('thtml -- ',thtml);

                // thtml = 'ceva';
                _t.html(thtml);
              }




              // -- regex replace here TODO: yes

              if(o.transition_text!='none'){

                var reg_replr = /({{.*?}})/g;




                _t.html(thtml.replace(reg_replr, '<span class="the-text-transition-con">$1</span>'));

                _t.data('text-transition-con',_t.find('.the-text-transition-con').eq(0));



                // console.info(reg_replr.exec(thtml));

                _t.data('text-var',reg_replr.exec(thtml)[1]);
              }







            }
          }

          //console.info('_t data-animprops - ',_t.attr('data-animprops'));
          //console.log(_t,textisvar);
          if(_t.attr('data-animprops')){
//                    console.info(cthis, _t);


            animprops = {};

            try{

              animprops = JSON.parse(_t.attr('data-animprops'));
            }catch(err){
              console.log('did not parse anim props', animprops, err);
            }
//                    _t.data('animprops', JSON.parse(_t.attr('data-animprops')));
            _t.data('animprops', animprops);
//                    jQuery.data(_t, 'animprops', 'ceva');

            // console.info('animprops - ',animprops);


            var circle_args = {};

            if(_t.data('circle_args')){
              circle_args = _t.data('circle_args');
            }


            var animprops = _t.data('animprops');









            for(var olab in animprops){



              var val3 = animprops[olab];

              // console.info(olab,val3);

              if(String(val3).indexOf('{{arg')>-1) {
                var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
                var auxa = regex_getdef.exec(String(val3));
                if (auxa) {
                  if (auxa[2]) {
                    animprops[olab] = (auxa[2]);
                  }
                }


              }
            }



            // console.info(animprop, animprops[animprop]);




            for(var animprop in _t.data('animprops')) {
              // console.info(animprop, animprops[animprop]);

              var val = animprops[animprop];
              for(var i=0;i<circle_args.length;i++) {

                circle_args[animprop] = val;
                _t.data('circle_args', circle_args);
              }




              //console.info('animprop - ',animprop);
              if(animprop=='background' || animprop=='background-color' || animprop=='circle_outside_fill'){

                //console.info(val);

                if(String(val) && String(val).indexOf('.')>-1){
                  //console.info('lets animate this - ',val);

                  var aux = String(val).split('.');
                  _t.data('startbgcolor',hexToRGBarr(aux[0]));
                  _t.data('currbgcolor',hexToRGBarr(aux[0]));
                  _t.data('endbgcolor',hexToRGBarr(aux[1]));

                  //console.info('startbgcolor - ',_t.data('startbgcolor'));
                  //console.info('endbgcolor - ',_t.data('endbgcolor'));
                }else{

                  _t.css(animprop,sanitize_for_css_value(val));
                }
              }
            }




            for(var lab in animprops){
              //console.info(lab, ' - ',animprops[lab]);

              if(String(animprops[lab]).indexOf('{{')>-1){
                animprops[lab] = sanitize_for_css_value(animprops[lab]);
              }
              //console.info(lab, ' - ',animprops[lab]);
            }

            if(_t.attr('data-gradient-background')){

              var aux = String(_t.attr('data-gradient-background')).split(',');


              var gradient_angle = 135;


              if(_t.attr('data-gradient-angle')){
                gradient_angle = _t.attr('data-gradient-angle');
              }


              var aux2 = 'linear-gradient('+gradient_angle+'deg, '+aux[0]+' 0%,'+aux[1]+' 100%)';

              //aux2 = 'linear-gradient(135deg, #1e5799 0%,#7db9e8 100%)';

              //console.info('gradiente - ',aux2, _t);
              _t.css({
                'background':aux2
              })
              _t.css(
                'background',aux2
              )

              _t.get(0).style.background = aux2;

              _t.css('opacity',0.5);

              //return false;
            }


            if(textisvar){
              var thtml = _t.html();
              if(_t.data('data-initial-text')){
                thtml = _t.data('data-initial-text');
              }
              animprops['text'] = thtml;
              _t.data('animprops', animprops);
            }
          }else{
            if(textisvar){

              var thtml = _t.html();
              if(_t.data('data-initial-text')){
                thtml = _t.data('data-initial-text');
              }
              animprops['text'] = thtml;
              _t.data('animprops', animprops);
            }
          }




          // console.warn('_t -- ',_t);

          if(_t.hasClass('progress-bar-item--text')){
            // var _thtml = _t.html();

            // if(_thtml.indexOf('{{maxnr}}')>-1){

            // _thtml  = String(_thtml).replace('{{maxnr}}',cthis_animprops.maxnr);
            // _t.html(_thtml);
            // }

            // console.warn('_thtml -- ',_thtml);

          }

          if(_t.hasClass('progress-bar-item--repeater')){
            // console.info('repeater animprops - ',_t.data('animprops'));

            var animprops = _t.data('animprops');

            animprops.steps = Number(animprops.steps);

            var _c = _t.find('.repeater-item--sample').eq(0);

            //console.warn(_c.get(0).style.width);



            // console.warn('repeater animprops - ',animprops);
            // console.warn('sample html -  ',_c.html());

            var _chtml = _c.html();







            if(String(_chtml).indexOf('{{arg')>-1) {


              var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
              var auxa = regex_getdef.exec(String(_chtml));
              if (auxa) {
                if (auxa[2]) {
                  _chtml = _chtml.replace(regex_getdef, auxa[2]);
                }
              }

              _c.html(_chtml);

            }


            if(_c.get(0)){

              var auxs = _c.get(0).style.width;

              var auxsNr = 99.5/ Number(auxs.replace('%',''));

              for(var i5 =0;i5<auxsNr;i5++){


                _t.append(_t.find('.repeater-item--sample').clone());

                var str_w = (1/auxsNr * 100) + '%';
                _t.children().last().removeClass('repeater-item--sample');
                _t.children().last().addClass('repeater-item--cloned');

                //.css('width',str_w)





              }
              _t.find('.repeater-item--sample').hide();
            }else{
              console.info('SAMPLE NOT FOUND');
            }
          }

          if(drawcircle){

            draw_circle(_t, _cnv, _cnv_ctx);
          }
        })

//                console.info(initon, started);

        if(initon=='init'){

          start_it();
        }

        if(initon=='scroll') {
          _w.bind('scroll', handle_scroll);
          handle_scroll();
        }
      }

      // time, begin, change ( finish - b ), duration
      var easeIn = function(t, b, c, d) {

        return -c *(t/=d)*(t-2) + b;

      };

      // percent, elapsed time, start value, end value, total duration
      function easeOutQuad (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
      };

      function animationFunction(t, b, c, d) {
        return easeOutQuad (t, b, c, d)
      };


      function animationFunction_for_colors(t, b, c, d) {
        //return easeOutQuad (t, b, c, d)
      };

      function debug_func(){
        //console.info(debug_var);
        debug_var = true;
      }

      function handle_resize(){
        calculate_dims();
      }

      function calculate_dims(){


        if(o.settings_makeFunctional==true){
          var allowed=false;

          var url = document.URL;
          var urlStart = url.indexOf("://")+3;
          var urlEnd = url.indexOf("/", urlStart);
          var domain = url.substring(urlStart, urlEnd);
          //console.log(domain);
          if(domain.indexOf('a')>-1 && domain.indexOf('c')>-1 && domain.indexOf('o')>-1 && domain.indexOf('l')>-1){
            allowed=true;
          }
          if(domain.indexOf('o')>-1 && domain.indexOf('z')>-1 && domain.indexOf('e')>-1 && domain.indexOf('h')>-1 && domain.indexOf('t')>-1){
            allowed=true;
          }
          if(domain.indexOf('e')>-1 && domain.indexOf('v')>-1 && domain.indexOf('n')>-1 && domain.indexOf('a')>-1 && domain.indexOf('t')>-1){
            allowed=true;
          }
          if(allowed==false){
            return false;
          }

        }


//                console.info('calculate_dims', cthis.children());
        cthis.find('.progress-bar-item').each(function() {
          var _t = $(this);
          _cnv = null;
          _cnv_ctx = null;

          if(_t.get(0).nodeName=="CANVAS"){
            _cnv = _t.get(0);
            _cnv_ctx = _cnv.getContext("2d");

          }

          if (_t.data('animprops')) {
            var animprops = _t.data('animprops');
            for (var animprop in _t.data('animprops')) {
              var val = animprops[animprop];
              if(val=='{{width}}'){
                val = val.replace('{{width}}', _t.outerWidth());
                _t.css(animprop, val);
              }
              if(val=='{{center}}'){
                if(animprop=='top'){
                  val = val.replace('{{center}}', Number(cthis.outerHeight()/2 - _t.outerHeight()/2) + 'px' );
//                                    console.info(_t, animprop, val);
                  _t.css(animprop, val);
                }
                if(animprop=='left'){
                  val = val.replace('{{center}}', Number(cthis.outerWidth()/2 - _t.outerWidth()/2) + 'px' );
//                                    console.info(_t, animprop, val);
                  _t.css(animprop, val);
                }

              }

              if(_cnv){
                _cnv.width = _t.outerWidth();
                _cnv.height = _t.outerHeight();
              }

              if(_t.hasClass('progress-bar-item--circ') && _cnv){

                draw_circle(_t, _cnv, _cnv_ctx);
              }
            }
          }
        });
        cthis.find('.dims-set').each(function() {
          var _t = $(this);


          if(_t.hasClass('height-same-as-width')){
            _t.height(_t.width());
          }

          // console.info('_t.get(0).style.height - ',_t.get(0).style.height);
          // console.info('_t.get(0).style - ',_t.get(0).style);
          // if(_t.get(0).style.height=='width'){
          //     console.info("HMM");
          // }
        });
      }


      function final_transition_text(){

        // console.error('FINAL FIBBAGE TRANSITION TEXT');
        handle_frame({
          continue_handle_frame: false
          ,'call_from':'final_fibbage'
          ,'text_transition_check_numbers':false
        });

        finished=true;
      }

      function handle_frame(pargs){


        var margs = {
          'continue_handle_frame':true
          ,'call_from':'default'
          ,'text_transition_check_numbers':true
        }

        if(pargs){
          margs = $.extend(margs,pargs);
        }

        //console.info('handle_frame() - ',cthis);


        function add_trans_in(_arg){
          _arg.addClass('settled');
          _arg.children('.preparing-transitioning-in').addClass('transitioning-in');




          if(text_transition_pending_left!=1000){
            text_transition_pending_left--;
            text_transition_pending_done++;
          }

          // console.info('text_transition_pending_done - ',text_transition_pending_done);

        }
        function remove_old_ref(_arg){

          _arg.children('.transitioning-out:not(.placeholder)').remove();
          _arg.removeClass('transitioning');
        }


        var currTime = new Date().getTime();
        var animTime = currTime - startTime;
        var animPerc = animTime / totalAnimTime;

        // console.info('cthis_animprops.initial_perc - ',cthis_animprops.initial_perc);

        if(cthis_animprops.initial_perc){

          animPerc = (animTime / totalAnimTime * (1 - cthis_animprops.initial_perc))+cthis_animprops.initial_perc;
        }
        var perc = 0; // -- the real perc


        //console.info('animTime - ', animTime);
        //console.info('animPerc - ', animPerc);
        //console.info('totalAnimTime - ', totalAnimTime);


        //console.log(cthis.find('.progress-bar-item'));

        cthis.find('.progress-bar-item').each(function() {
          var _t = $(this);
          var drawcircle = false;
          _cnv = null;
          _cnv_ctx = null;

          if(_t.get(0).nodeName=="CANVAS"){
            _cnv = _t.get(0);
            _cnv_ctx = _cnv.getContext("2d");
          }
//                    console.info(_cnv, _cnv_ctx);


          var animpropsaux = _t.data('animprops');
          if(_t.attr('data-type')!='container' && _t.html()!='' && String(_t.html()).indexOf('{{') > -1 && typeof animpropsaux=='object' && typeof animpropsaux.text=='undefined'  ){
            animpropsaux.text = (_t.html());

          }



          // console.warn('_t - ',_t,_t.data('animprops'));
          if(_t.data('animprops')){
            var animprops = _t.data('animprops');

            perc = 0;
            var perc100 = 0;

            var finalr = '0';
            var finalg = '0';
            var finalb = '0';


            if(currTime - startTime > totalAnimTime){
              finished=true;
              perc = maxperc;
              perc100 = 100;
            }else{

              perc = animationFunction(animPerc*totalAnimTime, 0, maxperc, totalAnimTime);
              perc100 = animationFunction(animPerc*totalAnimTime, 0, 100, totalAnimTime);

              // console.info('perc - ',perc);
              // console.info('perc100 - ',perc100);
              if(_t.data('startbgcolor')){

                var startbg = _t.data('startbgcolor');
                var endbg = _t.data('endbgcolor');
                //var currbg = _t.data('currbgcolor');

                finalr = parseInt((1-(perc/100)) * startbg.r + ( (perc/100) * endbg.r),10);
                finalg = parseInt((1-(perc/100)) * startbg.g + ( (perc/100) * endbg.g),10);
                finalb = parseInt((1-(perc/100)) * startbg.b + ( (perc/100) * endbg.b),10);


                finalhex = rgbToHex(finalr,finalg,finalb);



                //console.info('finalr - ',finalr, animPerc, maxperc, (1-(maxperc/100)) * startbg.r + ( (maxperc/100) * endbg.r));
                //console.info('animPerc*totalAnimTime - ',animPerc*totalAnimTime,maxperc,animationFunction(animPerc*totalAnimTime, 20, maxperc, totalAnimTime));
                //console.info('finalg - ',finalg, maxperc);
                //console.info('finalb - ',finalb, maxperc);
              }
            }
            if(perc>maxperc){
              perc = maxperc;
            }
            if(perc100>100){
              perc100 = 100;
            }

            // console.info('animprops->', animprops,_t );
            for(var animprop in _t.data('animprops')){

              // console.info('animprop->', animprop, animprops[animprop] );
              if(animprop=='active_bg_color'){
                // return false;
              }

              if(_t.attr('data-type')=='repeater'){
                if(animprop=='text'){

                  // console.warn('why is text here ? ',_t.data('animprops'));
                  delete _t.data('animprops').text;
                  delete _t.data('animprops')['text'];
                  delete animprops.text;
                  continue;
                }
              }

              var val = animprops[animprop];

              // -- this belongs in handle resize function



              if(val=='{{width}}'){
                val = val.replace('{{width}}', _t.outerWidth());
                _t.css(animprop, val);
              }




              // console.info('o.decimals - ',o.decimals);
              // console.info('animprop - ',animprop);

              if(animprop=='text'){

                if(val.indexOf('{{percmaxnr}}')>-1){


                  // console.warn('nununu', Number(o.decimals));

                }else{



                  if(cthis_animprops.decimals==0){

                    // console.warn('dadada', Number(o.decimals));
                    perc = parseInt(perc,10);
                  }else{
                    // console.warn(Number(o.decimals));
                    perc = Number(perc).toFixed(Number(cthis_animprops.decimals));
                  }
                }
              }

              // console.info('perc - ',perc, animprop);
              //console.info('ceva', animprop);
              val = String(val).replace('{{perc}}', perc+'%');
              val = String(val).replace('{{percinv}}', (100-perc)+'%'); // -- perc inverse
              val = String(val).replace('{{perc100}}', perc100+'%');
              val = String(val).replace('{{perc-decimal}}', perc/100);
              val = String(val).replace('{{perc100-decimal}}', perc100/100);



              if(String(val).indexOf('{{arg')>-1){
                var regex_getdef = new RegExp("{{arg(.)-default(.*?)}}");
                var auxa = regex_getdef.exec(String(val));
                if(auxa){
                  if(auxa[2]){
                    val = (auxa[2]);
                  }
                }


                // console.info('auxa - ',auxa);
//                    console.info(regex_getdef, auxa, cthis_animprops,auxa[2])
              }else{

              }

              if(perc>=99.99){
                cthis.find('.item-show-cond-when-perc-100').addClass('cond-ok');
              }


              // console.warn('parseInt(perc /100 * maxnr, 10) - ',parseInt(perc /100 * maxnr, 10),parseInt(perc /100 * maxnr, 10));
              var curr_val_for_max_nr = (perc /100 * maxnr);




              if(cthis_animprops.decimals==0){

                curr_val_for_max_nr = parseInt(curr_val_for_max_nr,10);
              }else{
                // console.warn(Number(o.decimals));
                curr_val_for_max_nr = Number(curr_val_for_max_nr).toFixed(Number(cthis_animprops.decimals));
              }

              var curr_val_for_max_nr_str = '';
              // console.info('curr_val_for_max_nr - ',curr_val_for_max_nr);

              //console.info('animprop - ',animprop);
              if(animprop=='background-color'){
                if(finalr!='0' || finalg!='0' || finalb!='0'){

                  //console.warn('rgb('+finalr+','+finalg+','+finalb+')');
                  _t.css(animprop,'rgb('+finalr+','+finalg+','+finalb+')')
                }
                //console.info('lets animate background color',perc);
              }


              if(animprop=='text'){

                if(val.indexOf('{{percmaxnr}}')>-1){




                  if(cthis_animprops.decimals==0){

                    curr_val_for_max_nr = parseInt(curr_val_for_max_nr,10);
                  }else{
                    // console.warn(Number(o.decimals));
                    curr_val_for_max_nr = Number(curr_val_for_max_nr).toFixed(Number(cthis_animprops.decimals));
                  }
                }else{

                }
              }


              if(o.thousand_separate_character){
                if(String(curr_val_for_max_nr).split('.')[0].length>3){

                  var iterations23 = Math.round( (String(curr_val_for_max_nr).length-2) / 3);
                  //console.info(curr_val_for_max_nr, iterations23);

                  _cach_final_str = '';
                  _cach_temp_str = String(curr_val_for_max_nr);

                  for(i29 = 0; i29<iterations23;i29++){

                    _cach_final_str = o.thousand_separate_character+ _cach_temp_str.substr(_cach_temp_str.length-3) + _cach_final_str;
                    //console.info(_cach_final_str,  _cach_temp_str.substr(_cach_temp_str.length-3));

                    _cach_temp_str = _cach_temp_str.substr(0,_cach_temp_str.length-3);


                  }

                  _cach_final_str= _cach_temp_str + _cach_final_str;

                  curr_val_for_max_nr = _cach_final_str;

                }

              }

              if(o.transition_text=='none') {

              }else{

                if(animprop=='text'){
                  //curr_val_for_max_nr_str='<div class="text-transition-con">'+curr_val_for_max_nr+'</div>';
                }
              }


              if(cthis_animprops.convert_1000_to_k=='on'){
                if(curr_val_for_max_nr > 1000){
                  curr_val_for_max_nr /= 1000;

                  curr_val_for_max_nr = parseInt(curr_val_for_max_nr,10);

                  curr_val_for_max_nr+='k';
                }
              }

              // console.info('curr_val_for_max_nr -> ',curr_val_for_max_nr);


              val = val.replace('{{percmaxnr}}', curr_val_for_max_nr);
              //console.info('curr_val_for_max_nr - ',curr_val_for_max_nr,'val - ', val, animprops);

              if(animprop=='width' || animprop=='height' || animprop=='opacity' || animprop=='left' || animprop=='right'|| animprop=='bottom'|| animprop=='top'){


                // console.warn('animprop - ',animprop, val);
                _t.css(animprop, val);
              }

              //console.info(_t, animprop);


              // console.warn('animprop - ',animprop, _t);
              if(animprop=='text'){

                var finalval = val;



                var regex_getdef = new RegExp("{{arg(.{0,1})-default(.*?)}}");
                var auxa = regex_getdef.exec(String(val));


                //console.info("REPLACING TEXT", _t, animprop);
                if(debug_var){
                }

                //console.info(String(val), auxa);
                if(auxa){
                  if(auxa[2]){
                    finalval = ( String(_t.html()).replace(regex_getdef, auxa[2]));
                  }
                }


                // console.info('finalval - ',finalval);
                if(o.transition_text=='none'){

                  // finalval = '30';
                  _t.html(finalval);
                }else{


                  var write_to_final_text = false;

                  //finalval = finalval.text();

                  var str = String(curr_val_for_max_nr);


                  final_text = str;

                  // console.warn(str);
                  // console.info(str.length);
                  // console.info(_t.data('text-transition-con'));
                  // console.info('text-var - ' ,_t.data('text-var'));


                  if(inter_final_transition_text){
                    clearTimeout(inter_final_transition_text);


                  }

                  if(margs.call_from!='final_fibbage'){

                    inter_final_transition_text = setTimeout(final_transition_text,600);
                  }

                  var _tt = _t.data('text-transition-con');



                  // return false;




                  if(text_transition_pending_left<=0 || margs.call_from=='final_fibbage'){


                    // console.error("ADDING TO PROGRESS BARS", text_transition_pending_arr);

                    for(var i12 in text_transition_pending_arr){
                      var cach = text_transition_pending_arr[i12].val;



                      _tt.append('<span class="dzsprg-digit-con not-settled"><span class="dzsprg-digit preparing-transitioning-in all-new">'+cach+'</span><span class="dzsprg-digit placeholder">'+cach+'</span></span>');


                      setTimeout(add_trans_in,100,_tt.children().last());
                      if( (ind==0 && cach=='0')==false ){
                      }

                    }

                    text_transition_pending_arr = [];

                    text_transition_pending_left = 1000;
                  }



                  // console.info('_tt - ',_tt);
                  if(_tt){

                    var ind = 0;
                    for(var i4 in str){
                      // console.log(i4 + ' - ',str[i4]);

                      if(_tt && _tt.children().eq(ind).length){

                        var _cd = _tt.children().eq(ind);

                        // console.info('ind - ',ind);
                        // console.info('str[i4] - ',i4, str[i4]);


                        var nr_curr_val_str = "0";
                        var nr_curr_val = 0;


                        // console.groupCollapsed(("pretransitioning"));
                        // console.warn( ' _tt.data(\'curr_val\') -> ', _tt.data('curr_val'))
                        // console.info('_tt - ',_tt);
                        // console.groupEnd();
                        if(_tt.data('curr_val')){

                          nr_curr_val_str = '';
                          var auxarr = _tt.data('curr_val');
                          for(var i3 in auxarr){
                            nr_curr_val_str+=auxarr[i3];
                          }


                          nr_curr_val = Number(nr_curr_val_str);
                          // nr_curr_val = Number(auxarr)
                        }
                        if(_tt.data('curr_text')){


                          nr_curr_val = Number(_tt.data('curr_text'));
                        }


                        if(_cd.hasClass('transitioning') || str[i4]==_cd.find('transitioning-in').html() || (ind==0 && str[i4]=='0') || (margs.text_transition_check_numbers && nr_curr_val > Number(str)) ){

                          if(nr_curr_val > Number(str)){


                            if(debug_var){
                              //console.info('handle_frame() - _t - ',_t);
                              //console.info(currTime - startTime);
//                    console.info(easeOutQuad(animPerc, animPerc*totalAnimTime, 0, 100, totalAnimTime));


                              console.warn('rejected because current value bigger then string ...  _tt.data(\'curr_text\') - ' ,_tt.data('curr_text'),'nr_curr_val - ' ,nr_curr_val, 'Number(str) - ', Number(str),nr_curr_val > Number(str));


                              debug_var = false;
                            }


                          }

                        }else{
                          _cd.addClass('transitioning');



                          // console.groupCollapsed("TRANSITIONING VARS");
                          // console.warn(str[i4],' _tt.data(\'curr_text\') -> ', _tt.data('curr_text'));
                          // console.info('_tt - ',_tt);
                          // console.info('_cd - ',_cd);
                          // console.error(str, finished);
                          // console.error('nr_curr_val_str - ' ,nr_curr_val_str,'nr_curr_val - ' ,nr_curr_val, 'Number(str) - ', Number(str),nr_curr_val > Number(str));
                          // console.log(margs);
                          //
                          // console.groupEnd();



                          // console.warn(str);

                          _cd.children('*:not(.placeholder)').addClass('transitioning-out');
                          _cd.append('<span class="dzsprg-digit preparing-transitioning-in">'+str[i4]+'</span>')



                          /*

                           var curr_val = [];
                           if(_tt.data('curr_val')){
                           curr_val = _tt.data('curr_val');
                           }

                           curr_val[i4] = str[i4];


                           _tt.data('curr_val', curr_val);

                           */

                          if(_cd.hasClass('all-new')){
                            _cd.removeClass('all-new')
                          }else{

                            _cd.attr('curr_val', str[i4]);
                            _cd.data('curr_val', str[i4]);

                          }


                          write_to_final_text = true;




                          setTimeout(add_trans_in,o.transition_text_anim_time/5 + i4*10,_cd);
                          // setTimeout(remove_old_ref,500 * ind+20,_cach);
                          setTimeout(remove_old_ref,o.transition_text_anim_time + (o.transition_text_anim_time/2) ,_cd);


                        }
                      }else{


                        // appending



                        var len = _tt.children().length;
                        // console.info('len - ',len);
                        if(len==0 ){
                          //|| text_transition_pending_done==0
                          _tt.html(' ');

                          // console.info('_TT HTML BLANK')

                          var aux = {
                            'for_position':0
                            ,'val':str[i4]
                          }

                          text_transition_pending_arr.push(aux);

                          text_transition_pending_left = 0;
                        }else{


                          var add_to_arr = true;
                          for(var i5 in text_transition_pending_arr){



                            if(text_transition_pending_arr[i5].for_position==len){
                              add_to_arr=false;
                            }


                          }

                          if(add_to_arr){
                            var aux = {
                              'for_position':len
                              ,'val':str[i4]
                            }


                            text_transition_pending_arr.push(aux);

                            text_transition_pending_left = len;


                            if(debug_var){

                              // console.info('text_transition_pending_left - ',text_transition_pending_left,'text_transition_pending_arr - ', ind);
                              //
                              // for(var i23 in text_transition_pending_arr){
                              //     console.warn(text_transition_pending_arr[i23]);
                              // }
                              // debug_var = false;
                            }
                          }


                        }





                      }

                      ind++;
                    }

                    if(write_to_final_text){
                      var curr_text = '';

                      _tt.children().each(function(){
                        var _t1 = $(this);

                        // console.info('_t1 - ',_t1,_t1.data('curr_val'));

                        if(_t1.data('curr_val')){

                          curr_text+=_t1.data('curr_val');
                        }
                      })

                      _tt.data('curr_text', curr_text);

                    }



                  }




                }

              }

              for(var i=0;i<circle_vars.length;i++){
                if(animprop==circle_vars[i]){
//                                console.info(_t.data('circle_args'));
//                                console.info(perc/100, Number(val));
                  var circle_args = {};

                  if(_t.data('circle_args')!=undefined && _t.data('circle_args')!=''){
                    circle_args = _t.data('circle_args');
                  }
                  circle_args[animprop] = val;
                  drawcircle = true;
                  _t.data('circle_args', circle_args);
//                                console.info(perc, animprops);
                }
              }
              if(circle_args && finalhex){

                circle_args.finalhex = finalhex;
              }




              // console.info(animprop, animprops[animprop]);

              // return false;


            }
            // return false;
          }

          if(debug_var){
            //console.info('handle_frame() - _t - ',_t);
            //console.info(currTime - startTime);
//                    console.info(easeOutQuad(animPerc, animPerc*totalAnimTime, 0, 100, totalAnimTime));
//                         debug_var = false;
          }


          if(drawcircle){

            draw_circle(_t, _cnv, _cnv_ctx);
          }


          if(_t.hasClass('progress-bar-item--repeater')){

            var animprops = _t.data('animprops');





            animprops.steps = Number(animprops.steps);
            //var len = Math.floor(animPerc*animprops.steps);
            var ilen = _t.children('.repeater-item:not(".repeater-item--sample")').length;
            var len = Math.floor(perc/100*ilen)
            // console.error('len - ',len);
            // console.error('ilen - ',ilen);
            for (var i5=0;i5<len;i5++){


              var _c3 = _t.children('.repeater-item:not(".repeater-item--sample")').eq(i5);

              if(_t.hasClass('repeater-transition-colors')){

                // console.info('_c3 - ',_c3, ' ',cthis);



                // console.info(animprops);




              }
              if(animprops.repeater_active_bg_color){

                _c3.find('.progress-icon-con').css('background-color',animprops.repeater_active_bg_color);
              }
              if(animprops.repeater_active_color){

                _c3.find('.progress-icon-con').css('color',animprops.repeater_active_color);
              }
              _c3.addClass('active');
            }


          }
        });






        if(sw_stop_enter_frame){
          return false;
        }

        if(margs.continue_handle_frame && finished==false){
          requestAnimFrame(handle_frame);
        }

      }

      function hexToRGB(hex,alphaYes){
        var h = "0123456789ABCDEF";
        var r = h.indexOf(hex[1])*16+h.indexOf(hex[2]);
        var g = h.indexOf(hex[3])*16+h.indexOf(hex[4]);
        var b = h.indexOf(hex[5])*16+h.indexOf(hex[6]);
        if(alphaYes) return "rgba("+r+", "+g+", "+b+", 1)";
        else return "rgb("+r+", "+g+", "+b+")";
      }

      function hexToRGBarr(hex,alphaYes){
        hex = hex.replace('#','');
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        if(alphaYes) return "rgba("+r+", "+g+", "+b+", 1)";
        else return {r: r, g:g, b:b};
      }
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

      function sanitize_for_css_value(arg){

        var regex_getdef = new RegExp("{{arg(.{0,1})-default(.*?)}}");
        var auxa = regex_getdef.exec(String(arg));

        //console.info(String(val), auxa);
        if(auxa){
          if(auxa[2]){
            return auxa[2];
          }
        }

        return arg;
      }

      function draw_circle(_t, _cnv, _cnv_ctx){

        var circle_args = {
          'circle_inside_fill' : 'transparent'
          ,'circle_outside_fill' : '#fb5757'
          ,'circle_line_width' : '50'
          ,'circle_outer_width' : '0.5'// -- a value from 0 to 1 where 1 is the full circle
        };



//                console.info(_t.data('circle_args'));
        if(_t.data('circle_args')!=undefined && _t.data('circle_args')!=''){
          circle_args = $.extend(circle_args, _t.data('circle_args'));
        }

        //console.info('circle_args.circle_outside_fill - ',circle_args.circle_outside_fill)
        if(String(circle_args.circle_outer_width).indexOf('{{') > -1 || _cnv==null){
          return;
        }


        var centerX = _cnv.width / 2;
        var centerY = _cnv.height / 2;
        var radius = _cnv.width/2-circle_args.circle_line_width;
        var startAngle = -0.5*Math.PI;

        var circle_outer_width = Number(circle_args.circle_outer_width)*2 - 0.5;

        var endAngle = circle_outer_width * Math.PI;



//                                console.info(circle_args);

        _cnv_ctx.clearRect(0,0,_cnv.width, _cnv.height);


        _cnv_ctx.beginPath();
//                _cnv_ctx.lineCap = 'round';
//                console.info(_cnv.width, circle_args.circle_line_width, centerX,centerY, radius, startAngle, endAngle)
        if(radius>0){
          _cnv_ctx.arc(centerX, centerY, radius, startAngle,  endAngle, false);
        }

        if(circle_args.circle_inside_fill!='' && circle_args.circle_inside_fill!='transparent') {
          _cnv_ctx.fillStyle = circle_args.circle_inside_fill;
          _cnv_ctx.fill();
        }
        if(circle_args.circle_outside_fill!='' && circle_args.circle_outside_fill!='transparent'){

          if(String(circle_args.circle_outside_fill).indexOf(',')>-1){
            var grad= _cnv_ctx.createLinearGradient(0, 0, _cnv.width, _cnv.width);

            var auxa = String(circle_args.circle_outside_fill).split(',')
            grad.addColorStop(0, auxa[0]);
            grad.addColorStop(1, auxa[1]);

            _cnv_ctx.strokeStyle = grad;
          }else{

            if(String(circle_args.circle_outside_fill).indexOf('.')>-1){

              if(circle_args.finalhex){
                _cnv_ctx.strokeStyle = circle_args.finalhex;
              }
            }else{

              _cnv_ctx.strokeStyle = circle_args.circle_outside_fill;
            }
          }

          //console.info(circle_args);
          _cnv_ctx.lineWidth = circle_args.circle_line_width;
          _cnv_ctx.stroke();
        }
      }


      return this;
    });
  }
  window.dzsprb_init = function(selector, settings){
    if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
      var element_count = 0;
      for (var e in settings) { element_count++; }
      if(element_count==1){
        settings = undefined;
      }

      $(selector).each(function(){
        var _t = $(this);
        _t.progressbars(settings)
      });
    }else{
//            console.info(selector, $(selector));
      $(selector).progressbars(settings);
    }
  }
})(jQuery);


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

if(typeof jQuery!='undefined'){
  jQuery(document).ready(function($){
    dzsprb_init('.dzs-progress-bar.auto-init',{init_each : true});
  })
}else{
  alert('progressbar.js - this plugin is based on jQuery -> please include jQuery')
}



(function($) {

  $.textMetrics = function(el) {

    var h = 0, w = 0;

    var div = document.createElement('div');
    document.body.appendChild(div);
    $(div).css({
      position: 'absolute',
      left: -1000,
      top: -1000,
      display: 'none'
    });

    $(div).html($(el).html());
    var styles = ['font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing'];
    $(styles).each(function() {
      var s = this.toString();
      $(div).css(s, $(el).css(s));
    });

    h = $(div).outerHeight();
    w = $(div).outerWidth();

    $(div).remove();

    var ret = {
      height: h,
      width: w
    };

    return ret;
  }

})(jQuery);




window.init_progress_bars = function(){

  dzsprb_init('.dzs-progress-bar.auto-init',{init_each : true});

  jQuery('.dzs-progress-bar.inited').each(function(){
    var _t3 = jQuery(this);


    if(typeof(_t3.get(0))!='undefined' && typeof(_t3.get(0).api_restart_and_reinit)!='undefined'){
      _t3.get(0).api_restart_and_reinit();
    }
  });
}