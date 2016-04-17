(function() {

   'use strict';

   angular
      .module('homeWelcome')
      .component('homeTitle',

      {
         bindings: {
            title: '='
         },
         controller: 'homeController',
         template: function () {
            return `
               <div class="title_content">
                  <h1>{{::homeContent.title}}</h1>
                  <h2>{{::homeContent.subtitle}}</h2>
               </div>
            `;
         }
      });

})();
