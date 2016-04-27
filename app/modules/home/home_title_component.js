(function() {

   'use strict';

   const loadComponent = {
      bindings: {
         title: '=',
         user: '='
      },
      template: function () {
         return `
         <div class="title_content">
            <svg width="60px" height="90px" viewBox="0 0 80 140" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                <!-- Generator: Sketch 3.4.3 (16044) - http://www.bohemiancoding.com/sketch -->
                <title>Untitled</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                    <text id="H" sketch:type="MSTextLayer" font-family="MANIFESTO" font-size="95" font-weight="normal" fill="rgba(219, 10, 91, 1)">
                        <tspan x="0" y="121">H</tspan>
                    </text>
                </g>
            </svg>
            <h1>{{::$ctrl.title.title}}</h1>
            <h3>{{::$ctrl.title.subtitle}}</h3>
            <!--div class="gituser">
               <h3>{{::$ctrl.user.login}}</h3>
               <h4>{{::$ctrl.user.url}}</h4>
            </div-->
         </div>
         `;
      }
   };

   ////////

   angular
   .module('homeWelcome')
   .component('homeTitle', loadComponent);

})();
