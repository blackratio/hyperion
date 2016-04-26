(function() {

   'use strict';

   ////////

   const loadComponent = {
      bindings: {
         title: '=',
         user: '='
      },
      template: function () {
         return `
            <div class="title_content">
               <h1>{{::$ctrl.title.title}}</h1>
               <h2>{{::$ctrl.title.subtitle}}</h2>
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
