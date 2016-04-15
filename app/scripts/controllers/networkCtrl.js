'strict';

controllers.controller('networkController', ['$scope', '$timeout', 'networkServices',
   function($scope, $timeout, networkServices) {


      // Initialize vm (replace scope) to this value : controllerAs implementation
      const vm = this;


      networkServices.graphCallOject()
         .then(function(datas) {

            /**
             * Graph contient les données du graph.
             */
            function Graph() {
               this.node = [];
               this.link = [];
               this.group = [];
               this.mapNode = {};
               this.mapLink = {};
               this.mapGroup = {};
               this.groupId = 0;
            }

            var g = new Graph();

            var padding = 10;
            //var width = document.body.clientWidth - (4 * padding);
            var width = 1000;
            var height = 580;
            //var height = document.body.clientHeight - (4 * padding);

            /** SVG elements. */
            var links, nodes, labels;

            /** raw datas. */
            var graph = {};
            /** nodes. */
            graph.node = [];
            /** links.*/
            graph.link = [];
            /** group of node.*/
            graph.group = [];
            /** Compteur pour les ID des group. */
            graph.groupId = 0;


            /** Indicateur de dragging. */
            var dragging = false;
            /** Indicateur d'affichage du tableau d'information */
            var tableInfoShowed = true;

            /** Map<String, int> contenant les clé et les index des noeuds. */
            var map = {};
            /** Map<String, int> contenant les "source-target" et les index des liens. */
            var mapLink = {};
            /** Map<int, int> contenant les index et le nb de relations. */
            var arrayEndNode = [];

            /** Menu de context visible.*/
            var contextMenu = false;
            /** Derniere cible du menu de context. */
            var lastTarget;
            /** donnée du menu de context. */
            var data;
            /** affichage des noeuds d'extrémité. */
            var endNodeShowed = true;

            /** Indicateur de surlignage des liens. */
            var isLinksHighlighted = true;


            //TODO : Force layout mais à voir si on ne peut pas en prendre d'autre
            // dans certains cas (eg. chemin).
            var layout = d3.layout.force()
               .charge(-1000)
               .linkDistance(100)
               .size([width, height])
               .on("tick", tick);

            /**
             * Zoom
             */
            var zoom = d3.behavior.zoom()
               .scaleExtent([0.3, 10])
               .on("zoomstart", zoomstart)
               .on("zoom", rescale)
               .on("zoomend", zoomend);

            /**
             * Dragging
             */
            var drag = layout.drag()
               .on("dragstart", dragstart)
               .on("drag", dragmove)
               .on("dragend", dragend);


            //Initialisation du SVG
            var divgraph = d3.select("#relation_graph")
               .append("svg")
               .attr("width", width)
               .attr("height", height)
               .attr("pointer-events", "all")
               .on("mousemove", mousemove)
               //.on("mousedown", mousedown)
               //.on("mouseup", mouseup)

            .call(zoom)
               //.on("dblclick.zoom", null)
               //.on('contextmenu', showContextMenu)
               //.on("click", svgClick);




            var vis = divgraph.append("g");
            //	.append("g")
            //		.on("mousemove", mousemove)
            //		.on("mousedown", mousedown)
            //		.on("mouseup", mouseup)
            //		.on("contextmenu", function(){
            //
            //		});

            // Adding a white rect, trick to pan and zoom.
            //vis.append("rect")
            //	.attr("id", "background")
            //	.attr("class", "background")
            //	.attr("width", width)
            //	.attr("height", height)
            //	.attr("fill", "none");



            var control = divgraph.append("g").attr("id", "control");
            /*------------------------------------------------------------------------------

            control.append("line")
               .attr("id", "center-1")
               .attr("x1", 2)
               .attr("y1", 15)
               .attr("x2", 28)
               .attr("y2", 15)
               .style("stroke-width", 0.5)
               .style("stroke", "#999999")
               .on("mouseover", highligthControl)
               .on("mouseout", unhighligthControl)
               .on("click", center);

            control.append("line")
               .attr("id", "center-2")
               .attr("x1", 15)
               .attr("y1", 2)
               .attr("x2", 15)
               .attr("y2", 28)
               .style("stroke-width", 0.5)
               .style("stroke", "#999999")
               .on("mouseover", highligthControl)
               .on("mouseout", unhighligthControl)
               .on("click", center);

            control.append("circle")
               .attr("id", "center-3")
               .attr("cx", 15)
               .attr("cy", 15)
               .attr("r", 10)
               .attr("fill", "none")
               .style("stroke-width", 0.5)
               .style("stroke", "#999999")
               .on("mouseover", highligthControl)
               .on("mouseout", unhighligthControl)
               .on("click", center);

            control.append("circle")
               .attr("id", "center-4")
               .attr("cx", 15)
               .attr("cy", 15)
               .attr("r", 5)
               .attr("fill", "#999999")
               .on("mouseover", highligthControl)
               .on("mouseout", unhighligthControl)
               .on("click", center);


            function highligthControl(){
               d3.select("#center-1").style("stroke", "red");
               d3.select("#center-2").style("stroke", "red");
               d3.select("#center-3").style("stroke", "red");
               d3.select("#center-4").style("stroke", "red").attr("fill", "red");
            }

            function unhighligthControl(){
               d3.select("#center-1").style("stroke", "#999999");
               d3.select("#center-2").style("stroke", "#999999");
               d3.select("#center-3").style("stroke", "#999999");
               d3.select("#center-4").style("stroke", "#999999").attr("fill", "#999999");
            }


            function center(){
               translateX1 = 0;
               translateY1 = 0;
               console.log("transform=\"translate("+ d3.event.translate +")" + " scale(1)\"");
               vis.attr("transform", "scale(1)");
            }
            //----------------------------------------------------------------------------------*/


            d3.select(window).on("resize", resize);


            // Récupération des données au format JSON
            //loadJsonFromUrl(datas);




            /* *****************************************************************
             *						   Graphic function
             **************************************************************** */
            /**
             * Cette fonction permet de construire le graphe à partir du JSON récupérer à une
             * URL passé en paramètre. Globalement l'URL du proxy JSON de l'application.
             * @param url l'url a requêter pour récupérer le JSON
             */


            if (datas.error) {
               control.append("text")
                  .attr("x", 0)
                  .attr("y", 15)
                  .style("font-family", "sans-serif")
                  .style("font-size", "20px")
                  .style("text-decoration", "underline")
                  .text("Error : ");

               if (json.error.proxy) {
                  control.append("text")
                     .attr("x", 10)
                     .attr("y", 30)
                     .text("Proxy ");
                  control.append("text")
                     .attr("x", 107)
                     .attr("y", 30)
                     .text(": " + json.error.proxy);
               }
               if (json.error.java_message) {
                  control.append("text")
                     .attr("x", 10)
                     .attr("y", 50)
                     .text("Java Message");
                  control.append("text")
                     .attr("x", 107)
                     .attr("y", 50)
                     .text(": " + json.error.java_message);
               }
               if (json.error.java_stacktrace) {

                  control.append("text")
                     .attr("x", 10)
                     .attr("y", 70)
                     .text("Java Stacktrace :");
                  var i = 70;

                  json.error.java_stacktrace.split("\r\n\t").forEach(function(entry) {
                     control.append("text")
                        .attr("x", 115)
                        .attr("y", i)
                        .text(entry);
                     i = i + 20;
                  });
               }
               return;
            }


            //Ajout des noeuds dans le graph
            datas.nodes.forEach(function(entry) {
               entry.x = width / 2;
               entry.y = height / 2;
               entry.visible = true;
               // Ne marche que pour relation...
               entry.father = graph.node[0];
               map[entry.key] = entry.id;
               graph.node.push(entry);
            });

            // Ajout des liens dans le graph
            datas.links.forEach(function(entry) {
               entry.visible = true;
               addLink(entry, false);
            });


            graph.pathId = datas.pathId;

            if (graph.node[0]) {
               graph.node[0].expanded = true;
               graph.node[0].children = new Array();
               graph.node.forEach(function(node) {
                  if (graph.node[0].key != node.key) {
                     graph.node[0].children.push(node);
                  }
               });
            }

            //Mise à jour du graph
            update();


            /**
             * Update the graph.
             */
            function update() {

               purgeGraph();

               // Checking if we have result.
               if (graph.node.length === 0) {
                  //vis.append("text")
                  control.append("text")
                     .attr("x", width / 2)
                     .attr("y", height / 2)
                     .attr("class", "noResult")
                     .text("No Result !");
                  return;
               }

               // Starting force layout.
               layout.nodes(graph.node)
                  .links(graph.link);
               layout.start();


               // ploting links
               links = vis.selectAll("line").data(graph.link);
               //Enter links
               links.enter().insert("line").attr("class", "link")
                  .attr("id", function(d) {
                     return "link-" + d.index;
                  })
                  .attr("x1", function(d) {
                     return d.source.x;
                  })
                  .attr("y1", function(d) {
                     return d.source.y;
                  })
                  .attr("x2", function(d) {
                     return d.target.x;
                  })
                  .attr("y2", function(d) {
                     return d.target.y;
                  })
                  //		.attr("stroke-dasharray", function(d){
                  //			var t = d.from + d.to;
                  //			if(t < 10)
                  //				return "2,5";
                  //			else
                  //				return "";
                  //			})
                  .style("stroke-width", function(d) {

                     var t = d.source.lenght + d.target.lenght;
                     if (t < 5)
                        return 2 + "px";
                     else if (t < 10)
                        return 2.5 + "px";
                     else
                        return 3 + "px";
                  })
                  .style("stroke", linkColor)
                  .style("visibility", function(d) {
                     if (d.visible) return "visible";
                     else return "hidden";
                  })
                  //.on("click", linkClick)
                  .on("dblclick", linkDblClick);
               // Exit any old links
               links.exit().remove();


               //ploting nodes
               nodes = vis.selectAll("circle").data(graph.node);
               //Enter nodes
               nodes.enter().insert("circle")
                  .attr("class", "node")
                  .attr("id", function(d) {
                     return "circle-" + d.index;
                  })
                  .attr("cx", function(d) {
                     return d.x;
                  })
                  .attr("cy", function(d) {
                     return d.y;
                  })
                  .attr("r", function(d) {
                     return nodeRadius(d) + "px";
                  })
                  .attr("fill", color)
                  .style("visibility", function(d) {
                     if (d.visible) return "visible";
                     else return "hidden";
                  })
                  .style("stroke-width", function(d) {
                     if (d.selected) return 2 + "px";
                     else return 2 + "px";
                  })
                  .style("stroke", "#666")

               .on("click", nodeClick)
                  .on("dblclick", nodeDblclick)
                  .on("mouseover", nodeMouseOver)
                  .on("mouseout", nodeMouseOut)
                  .call(drag);

               // Exit any old node
               nodes.exit().remove();

               var marker = d3.select("svg").append("defs")
                  .append("marker")
                  .attr("id", "triangle")
                  .attr("refX", 40)
                  .style("fill", "red")
                  .attr("refY", 6)
                  .attr("markerUnits", "userSpaceOnUse")
                  .attr("markerWidth", 12)
                  .attr("markerHeight", 18)
                  .attr("orient", "auto")
                  .append("path")
                  .attr("d", "M 0 0 12 6 0 12 3 6");

               d3.selectAll("line").attr("marker-end", "url(#triangle)");

               //ploting labels
               labels = vis.selectAll("text").data(graph.node);
               //enter labels
               labels.enter().append("text")
                  .attr("id", function(d) {
                     return "text-" + d.index;
                  })
                  .attr("class", "label")
                  .attr("x", function(d) {
                     return d.x;
                  })
                  .attr("y", function(d) {
                     return (d.y - (nodeRadius(d) + 3));
                  })
                  .style("visibility", function(d) {
                     if (d.visible) return "visible";
                     else return "hidden";
                  })
                  .style("user-select", "none")
                  .style("text-anchor", "middle")
                  .text(function(d) {
                     return d.key;
                  })
                  .on("dblclick", labelDblclick);

            }


            function purgeGraph() {
               vis.selectAll("line").data(new Array())
                  .exit().remove();
               vis.selectAll("circle").data(new Array())
                  .exit().remove();
               vis.selectAll("text").data(new Array())
                  .exit().remove();
            }

            /**
             * TICK !!!
             */
            function tick() {
               links.attr("x1", function(d) {
                     return d.source.x;
                  })
                  .attr("y1", function(d) {
                     return d.source.y;
                  })
                  .attr("x2", function(d) {
                     return d.target.x;
                  })
                  .attr("y2", function(d) {
                     return d.target.y;
                  });

               nodes.attr("cx", function(d) {
                     return d.x;
                  })
                  .attr("cy", function(d) {
                     return d.y;
                  });

               labels.attr("x", function(d) {
                     return d.x;
                  })
                  .attr("y", function(d) {
                     return (d.y - (nodeRadius(d) + 2));
                  });
            }


            /**
             * Collapse a node.
             * @param node the node to be collapsed
             * @param index the node's index
             */
            function collapse(node, index) {
               // Si c'est un group on return
               if (node.group) return;
               // node already collapsed
               if (!node.expanded) return;
               //	console.log("collapsing " + node.key);

               // On fait disparaitre les enfants du noeuds
               node.children.forEach(function(children) {
                  // On fait disparaitre les enfants des enfants du noeuds
                  // de manière récursive.
                  if (children.children) {
                     collapse(children, children.index);
                  }

                  // Mise à jour des indicateurs du noeud
                  children.visible = false;
                  children.fixed = false;
                  children.selected = false;
               });

               // On fait disparaitre les relations qui contiennent un
               // noeud qui n'est pas visible. Les autres sont rendu visible.
               graph.link.forEach(function(link) {
                  /*if(!(link.target.visible && link.source.visible)){
                  	link.visible=false;
                  }
                  if(link.source.index == node.index){
                  	link.visible = false;
                  }*/
                  link.visible = false;
               });

               update();

               node.expanded = false;
            }


            /**
             * Expande a node.
             * @param node the node to be expanded
             * @param index the node's index
             */
            function expand(node, index) {
               //	console.log("expanding " + node.key);
               // On ne developpe pas les groupes.
               //	if(node.group)return;

               // Si le noeud a déjà des enfants on les rend visible
               // ainsi que les relations qui leur sont rattachés.
               if (node.children) {

                  node.children.forEach(function(children) {
                     /*if(undefined == children.inGroup){
                     	children.visible=true;
                     }*/
                     children.visible = true;
                  });

                  graph.link.forEach(function(link) {
                     /*if(((link.target.visible) && (link.source.visible)) &&
                     		((link.target.index == node.index)||(link.source.index == node.index))){
                     	link.visible=true;
                     }*/
                     link.visible = true;
                  });

                  update();
               }
               // Sinon on requête le proxy pour récupérer les enfants du noeud
               else {
                  node.children = [];
                  //d3.json("json?cmd=relation&node=" + node.key, function(json){

                  json = {
                     "node": [{
                        "id": 0,
                        "key": "root node",
                        "level": 0
                     }, {
                        "id": 1,
                        "key": "toto",
                        "level": 1
                     }, {
                        "id": 2,
                        "key": "titi",
                        "level": 1
                     }, {
                        "id": 3,
                        "key": "tata",
                        "level": 1
                     }, {
                        "id": 4,
                        "key": "children 1",
                        "level": 2
                     }, {
                        "id": 5,
                        "key": "children 2",
                        "level": 2
                     }, {
                        "id": 6,
                        "key": "children 3",
                        "level": 3
                     }, {
                        "id": 7,
                        "key": "children 4",
                        "level": 3
                     }],
                     "link": [{
                        "source": 0,
                        "target": 4,
                        "lastTo": "1999-12-31T22:59:59.000Z",
                        "lastFrom": "2013-10-14T15:09:54.000Z"
                     }, {
                        "source": 0,
                        "target": 5,
                        "lastTo": "1999-12-31T22:59:59.000Z",
                        "lastFrom": "2013-10-14T15:09:54.000Z"
                     }, {
                        "source": 4,
                        "target": 5,
                        "lastTo": "1999-12-31T22:59:59.000Z",
                        "lastFrom": "2013-10-14T15:09:54.000Z"
                     }, {
                        "source": 4,
                        "target": 6,
                        "lastTo": "1999-12-31T22:59:59.000Z",
                        "lastFrom": "2013-10-14T15:09:54.000Z"
                     }, {
                        "source": 7,
                        "target": 4,
                        "lastTo": "1999-12-31T22:59:59.000Z",
                        "lastFrom": "2013-10-14T15:09:54.000Z"
                     }]
                  };


                  var ids = {};

                  json.node.forEach(function(entry) {
                     var index = graph.node.length;

                     // le noeuds de niveau zéro est le noeuds clické
                     // on ne le rajoute pas au graphe
                     if (node.key == entry.key) {
                        ids[0] = node.index;
                        return;
                     }

                     // On ne rajoute pas le noeud parent du
                     // noeud clické au graphe
                     if (node.father) {
                        if (node.father.key == entry.key) {
                           ids[entry.id] = node.father.index;
                           return;
                        }
                     }

                     // On vérifie que le noeud n'existe pas déjà dans le graph
                     // si c'est le cas on ne le rajoute pas à nouveau mais on récupère son
                     // index stocké dans map.
                     if (map[entry.key]) {
                        ids[entry.id] = map[entry.key];
                        return;
                     }

                     // Si le noeuds n'est ni parent, ni déjà présent on le normalise
                     // on l'ajoute au graphe, le rend visible, et on ajoute la relation
                     // père<->fils avec le noeud.

                     //on fait la correspondance oldID => newID
                     ids[entry.id] = index;
                     entry.id = index;
                     entry.index = index;
                     entry.level = node.level + 1;
                     entry.visible = true;
                     entry.father = node;
                     map[entry.key] = entry.index;
                     graph.node.push(entry);
                     node.children.push(entry);
                  });


                  json.link.forEach(function(link) {
                     //*
                     // On récupère les nouveau identifiant dans le
                     // graph global.
                     var source = ids[link.source];
                     var target = ids[link.target];
                     // On remplace les anciens identifiants par les nouveaux
                     link.source = graph.node[source].index;
                     link.target = graph.node[target].index;
                     // on vérifie que le lien peut être visible
                     link.visible = graph.node[source].visible && graph.node[target].visible;
                     // On ajoute les bons pathID, et non ceux généré par le proxy JEE
                     link.pathId = [];
                     link.pathId.push(graph.pathId++);
                     // On ajoute le lien sans fusion avec un autre lien
                     addLink(link, false);
                     //*/


                     // on vérifie que l'on a pas un lien vers un noeud.
                     // si c'est le cas on ajoute un lien vers ce groupe.
                     if (undefined !== graph.node[source].inGroup) {
                        var group = graph.group[graph.node[source].inGroup];

                        var newLink = {};
                        newLink.source = group;
                        newLink.target = graph.node[link.target];
                        newLink.visible = newLink.source.visible && newLink.target.visible;
                        newLink.pathId = link.pathId;
                        newLink.from = link.from;
                        newLink.to = link.to;
                        newLink.lastFrom = link.lastFrom;
                        newLink.lastTo = link.lastTo;

                        addLink(newLink, true);

                        // On va récursivement créer des liens vers les groupes
                        // dans lesquels sont inscrits les noeuds.
                        while (undefined !== group.inGroup) {
                           group = graph.group[group.inGroup];

                           var newLink = {};
                           newLink.source = group;
                           newLink.target = graph.node[link.target];
                           newLink.visible = newLink.source.visible && newLink.target.visible;
                           newLink.pathId = link.pathId;
                           newLink.from = link.from;
                           newLink.to = link.to;
                           newLink.lastFrom = link.lastFrom;
                           newLink.lastTo = link.lastTo;

                           addLink(newLink, true);
                        }

                     }

                     if (undefined !== graph.node[target].inGroup) {
                        var group = graph.group[graph.node[target].inGroup];

                        var newLink = {};
                        newLink.source = graph.node[link.source];
                        newLink.target = group;
                        newLink.visible = newLink.source.visible && newLink.target.visible;
                        newLink.pathId = link.pathId;
                        newLink.from = link.from;
                        newLink.to = link.to;
                        newLink.lastFrom = link.lastFrom;
                        newLink.lastTo = link.lastTo;

                        addLink(newLink, true);

                        // On va récursivement créer des liens vers les groupes
                        // dans lesquels sont inscrits les noeuds.
                        while (undefined !== group.inGroup) {
                           group = graph.group[group.inGroup];

                           var newLink = {};
                           newLink.source = graph.node[link.source];
                           newLink.target = group;
                           newLink.visible = newLink.source.visible && newLink.target.visible;
                           newLink.pathId = link.pathId;
                           newLink.from = link.from;
                           newLink.to = link.to;
                           newLink.lastFrom = link.lastFrom;
                           newLink.lastTo = link.lastTo;

                           addLink(newLink, true);
                        }
                     }

                  });

                  update();

                  //});
               }

               node.expanded = true;
            }



            /* *****************************************************************
             *						   SVG event
             **************************************************************** */
            function svgClick() {
               if (contextMenu)
                  removeContextMenu();
               lastTarget = undefined;

               graph.link.forEach(function(l) {
                  l.isHighlighted = false;
               });

               if (isLinksHighlighted) {
                  links.style("stroke", linkColor);
                  isLinksHighlighted = false;
               }

               d3.select("#tableInfo").remove();
               tableInfoShowed = false;
            }



            /* *****************************************************************
             *						   Link event
             **************************************************************** */
            /**
             * Determine la couleur du lien.
             * @param {CortexLink} link
             */
            function linkColor(link) {

               isLinksHighlighted = true;

               if (link.isHighlighted) {
                  return "#1E90FF";
               }
               var t = link.from + link.to;
               if (t < 5)
                  return "#89C4F4";
               else if (t < 10)
                  return "#3498DB";
               else
                  return "#3A539B";
            }


            /**
             * Click sur un lien.
             * @param {CortexLink} link le lien
             */
            function linkClick(link) {

               graph.link.forEach(function(l) {
                  l.isHighlighted = false;
               });

               link.pathId.forEach(function(id) {
                  graph.link.forEach(function(l) {
                     if (-1 != l.pathId.indexOf(id))
                        l.isHighlighted = true;
                  });
               });

               links.style("stroke", linkColor);

               showLinkInformation(link);

               d3.select("#tableInfo").remove();
               if (tableInfoShowed) {
                  showLinkInformation(link);
               }

               d3.event.stopPropagation();

            }


            function linkDblClick(link) {
               showLinkInformation(link);
            }


            /**
             * Affiche les informations sur le lien dans la liste sous le graphe.
             * @param {CortexLink} link
             */
            function showLinkInformation(link) {
               console.log(link);
               /*d3.select("#tableInfo").remove();

               var infosList = d3.select("#list").append("div").attr("id", "tableInfo").attr("width", "100%");

               infosList.append("div").attr("class", "linkSource")
                  .html("Relation : " + link.source.key + " &larr;&rarr; " + link.target.key);
                  alert(link.source.key);
               var row = infosList.append("tr");
               row.append("td").attr("class", "indent");
               row.append("td").text("Direction").attr("class", "head");
               row.append("td").text("Contact").attr("class", "head");
               row.append("td").text("Dernier Contact").attr("class", "head");

               row = infosList.append("tr");
               row.append("td").attr("class", "indent");
               row.append("td").attr("class", "info").html(link.source.key + " &rarr; " + link.target.key);
               row.append("td").attr("class", "info").text(link.to);
               row.append("td").attr("class", "info").text(link.lastTo);

               row = infosList.append("tr");
               row.append("td").attr("class", "indent");
               row.append("td").attr("class", "info").html(link.source.key + " &larr; " + link.target.key);
               row.append("td").attr("class", "info").text(link.from);
               row.append("td").attr("class", "info").text(link.lastFrom);

               tableInfoShowed = true;*/


               $scope.$apply(function() {
                  $scope.linkInfos = angular.toJson(link);
               });


            }

            /* *****************************************************************
             *						   Node event
             **************************************************************** */
            /**
             * Renvoie la couleur du noeuds en fonction de son niveau.
             * @param node le noeud
             * @returns le code couleur
             */
            function color(node) {
               if (node.group) {
                  return "#f7ca18";
               }

               return -1 == node.level ? "#4ECDC4" : 0 == node.level ? "#4183D7" : 1 == node.level ? "#87D37C" : 2 == node.level ?
                  "#F5D76E" : 3 == node.level ? "#ECECEC" : 4 == node.level ? "#afeeee" : "#999";
            }


            /**
             * Calcule la taille du noeuds en fonction du nombre d'enfants de celui-ci,
             * si ce nombre est connu.
             * @param d le noeud
             * @returns la taille du noeuds
             */
            function nodeRadius(d) {
               if (d.group) {
                  return 15;
               }
               return d.children ? Math.sqrt(100 * d.children.length) : 8;
            }

            /**
             * Clique sur un noeud.
             * @param node le noeud sur lequel on a cliqué.
             * @param index l'index du noeud
             */
            function nodeClick(node, index) {


               // NO click on hidden node !!!
               if (!node.visible) return;

               // Drag and drop ?
               if (dragging) {
                  // end of dragging return !
                  node.fixed = true; // fixation du noeuds pour qu'il ne soit pas bouger par le force layout
                  dragging = false;
                  return;
               }

               if (node.selected) {
                  node.selected = false;
                  d3.select(this).style("stroke-width", 0.000001).style("stroke", "green");
               } else {
                  node.selected = true;
                  d3.select(this).style("stroke-width", 2).style("stroke", "#000");
               }

               //	console.log("node " + node.index);

            }


            /**
             * Double clique sur un noeud.
             * @param node le noeud sur lequel on a double cliqué
             * @param index l'index du noeud
             */
            function nodeDblclick(node, index) {

               // NO double click on hidden node !!!
               if (!node.visible) return;

               if (node.expanded) {
                  collapse(node, index);
               } else {
                  expand(node, index);
               }

            }


            /**
             * Passage de la souris sur un noeud.
             */
            function nodeMouseOver(node, index) {
               if (node.selected) {
                  d3.select(this).style("stroke-width", 2).style("stroke", "#000");
               } else {
                  d3.select(this).style("stroke-width", 2).style("stroke", "#fff");
               }
            }


            /**
             * Sortie de la souris au-dessus d'un noeud.
             */
            function nodeMouseOut(node, index) {
               if (!(node.selected)) {
                  d3.select(this).style("stroke-width", 2).style("stroke", "#666");
               } else {
                  d3.select(this).style("stroke-width", 2).style("stroke", "#666");
               }
            }



            /* *****************************************************************
             *						   Label event
             **************************************************************** */
            /**
             * Doucle click que un label
             */
            function labelDblclick(node, index) {
               if (!node.group) {
                  return;
               }

               layout.stop();

               var x = d3.select(this).attr("x");
               var y = d3.select(this).attr("y");

               // Récupération de la section dédié au graph.
               var canvas = d3.select("#relation_graph");
               // Coordonnées de la souris
               var mousePosition = d3.mouse(d3.select("body").node());
               // Construction du conteneur du formulaire;
               var popup = canvas.append("div")
                  .attr("id", "group-name-change")
                  .attr("class", "group-name-change")
                  .style("left", mousePosition[0] + "px")
                  .style("top", mousePosition[1] + "px")
                  //		.style("left", x+"px")
                  //		.style("top", y+"px")
                  //		.style("border", "1px solid")
                  .on('contextmenu', function() {
                     d3.event.preventDefault();
                  });

               var form = popup.append("form").attr("class", "group-name-change-form").attr("id", "group-name-change-form")
                  .attr("action", "javascript:changeGroupName(" + index + ")");
               var input = form.append("input").attr("class", "group-name-change-input").attr("id", "group-name-change-input")
                  .attr("name", "group-name-change-input").attr("type", "text").property("value", node.key)
                  .on("blur", removeEditName);

               input.node().focus();
               input.node().select();


            }

            function changeGroupName(index) {
               var value = d3.select('#group-name-change-input').node().value;
               var oldValue = graph.node[index].key;
               delete map[oldValue];
               graph.node[index].key = value;
               map[value] = index;
               update();
               removeEditName();
            }

            function removeEditName() {
               d3.select("#group-name-change").remove();
               layout.resume();
            }

            /* *****************************************************************
             *						   Zoom event
             **************************************************************** */
            var mouseX;
            var mouseY;

            var translateX1 = 0;
            var translateY1 = 0;
            var translateX2 = 0;
            var translateY2 = 0;
            var scale = 1;

            var d3translate = [0, 0];

            /**
             * Executed at the start of a zoom gesture.
             */
            function zoomstart() {
               var coordinates = d3.mouse(this);
               mouseX = coordinates[0];
               mouseY = coordinates[1];
            }

            $scope.zoomMin = function() {
               console.log('zoom');
               zoomstart();
            };

            /**
             * Executed when the view changes.
             */
            function rescale() {
               if (dragging) return;
               //	console.log("rescale");

               try {
                  d3translate = d3.event.translate;
                  var coordinates = d3.mouse(this);
                  translateX2 = coordinates[0] - mouseX;
                  translateY2 = coordinates[1] - mouseY;
                  mouseX = coordinates[0];
                  mouseY = coordinates[1];
               } finally {
                  scale = d3.event.scale;
               }


               translateX1 = translateX1 + translateX2;
               translateY1 = translateY1 + translateY2;
               //	var translate = translateX1 + ", " + translateY1;

               vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");

               d3translate = d3.event.translate;
               scale = d3.event.scale;

               //	console.log("scale = " + d3.event.scale);
               //	vis.attr("transform", "translate("+ translate +")" + " scale(" + scale + ")");
            }

            /**
             * Executed at the end of the current zoom gesture.
             */
            function zoomend() {
               //	console.log("zoomend");

               //	console.log("D3_translate = " + d3translate);

               mouseX = undefined;
               mouseY = undefined;
            }


            /* *****************************************************************
             *						Mouse event
             **************************************************************** */
            /**
             * Indique lequel des button de la souris est cliqué.<ul>
             * <li>0 : pour le bouton gauche</li>
             * <li>1 : pour la molette</li>
             * <li>2 : pour le bouton droit</li></ul>
             */
            var mouseEventButton;
            var brushing = false;
            var brushX = 0;
            var brushY = 0;
            var rectX = 0;
            var rectY = 0;


            function mousedown() {
               layout.stop();
               mouseEventButton = d3.event.button;
               if (0 == mouseEventButton) {
                  d3.event.stopImmediatePropagation();

                  var coordinates = d3.mouse(this);
                  mouseX = coordinates[0];
                  mouseY = coordinates[1];

                  rectX = coordinates[0] - d3translate[0];
                  rectY = coordinates[1] - d3translate[1];

                  //		control.append("rect").attr("x", rectX).attr("y", rectY).attr("id", "brush")
                  //			.style("fill", "#B0C4DE").style("fill-opacity", "0.1").style("stroke", "#000000")
                  //			.style("stroke-width", 0.5);

                  vis.append("rect").attr("x", rectX).attr("y", rectY).attr("id", "brush")
                     .attr("transform", "" + "scale(" + 1 / scale + ")")
                     .style("fill", "#B0C4DE").style("fill-opacity", "0.1").style("stroke", "#000000")
                     .style("stroke-width", 0.5);

                  brushing = true;
               }
            }


            function mousemove() {
               if (!brushing) return;
               if (dragging) {
                  mouseup();
                  return;
               }

               var coordinates = d3.mouse(this);
               var x = coordinates[0] - mouseX;
               var y = coordinates[1] - mouseY;
               mouseX = coordinates[0];
               mouseY = coordinates[1];

               brushX = brushX + x;
               brushY = brushY + y;

               var rectX2, rectY2;
               var rectWidth, rectHeight;

               if (brushX >= 0) {
                  rectX2 = rectX;
                  rectWidth = brushX;
               } else {
                  rectWidth = Math.abs(brushX);
                  rectX2 = rectX - rectWidth;
               }


               if (brushY >= 0) {
                  rectY2 = rectY;
                  rectHeight = brushY;
               } else {
                  rectHeight = Math.abs(brushY);
                  rectY2 = rectY - rectHeight;
               }

               d3.select("#brush").attr("x", rectX2).attr("y", rectY2).attr("width", rectWidth).attr("height", rectHeight);



               var x1 = rectX2 / scale;
               var y1 = rectY2 / scale;
               var x2 = (rectX2 + rectWidth) / scale;
               var y2 = (rectY2 + rectHeight) / scale;



               graph.node.forEach(function(node) {
                  if ((node.x >= x1) && (node.y >= y1) && (node.x <= x2) && (node.y <= y2) && node.visible) {
                     node.selected = true;
                  } else {
                     node.selected = false;
                  }
               });

               nodes.style("stroke-width", function(d) {
                  if (d.selected) return 2;
                  else return 0.000001;
               });
            }

            function mouseup() {
               layout.resume();
               d3.select("#brush").remove();
               brushing = false;
               brushX = 0;
               brushY = 0;
            }

            /* *****************************************************************
             *						Dragging event
             **************************************************************** */

            /**
             * When a drag gesture starts.
             * @param node
             * @param index
             */
            function dragstart(node, index) {
               //	console.log("dragstart");
               // NO drag'n'drop on hidden node !!!
               if (!node.visible) return;
               layout.stop();
            }

            /**
             * When the drag gesture moves.
             * @param node
             * @param index
             */
            function dragmove(node, index) {
               //	console.log("dragmove");
               // NO drag'n'drop on hidden node !!!
               if (!node.visible) return;
               // Indicate we're drag'n'dropping
               dragging = true;

               node.px += d3.event.dx;
               node.py += d3.event.dy;
               node.x += d3.event.dx;
               node.y += d3.event.dy;

               tick(); //this is the key to make it work together with updating both px,py,x,y on node !
            }

            /**
             * When the drag gesture finishes.
             * @param node
             * @param index
             */
            function dragend(node, index) {
               // NO drag'n'drop on hidden node !!!
               if (!node.visible) return;

               //	console.log("dragend");
               tick();
               layout.resume();
            }

            /* *****************************************************************
             *						Windows event
             **************************************************************** */

            function resize() {
               width = 1000;
               height = 850;
               divgraph.attr("width", width).attr("height", height);
               layout.size([width, height]).resume();
            }



            /* *****************************************************************
             *						Context Menu
             **************************************************************** */


            /**
             * Affichage du menu de context (click droit)
             * @param d
             * @param i
             */
            function showContextMenu(d, i) {
               //	console.log("showContextMenu");
               // empeche le menu de context naturel du navigateur
               d3.event.preventDefault();
               // effacement du menu si déjà présent
               if (contextMenu) {
                  removeContextMenu();
               }
               // récupération de la cible
               var target = d3.select(d3.event.target);
               // Combine pour ne pas réafficher le menu
               if (lastTarget)
                  if (target.node() == lastTarget.node()) {
                     lastTarget = undefined;
                     return;
                  }
               lastTarget = target;
               // Récupération des données liées à la cible.
               data = target.datum();
               // Récupération de la section dédié au graph.
               var canvas = d3.select("#relation_graph");

               //---- Construction du menu de contexte.
               // Récupération des coordonnées de la souris sur la page.
               var mousePosition = d3.mouse(d3.select("body").node());
               // Construction du conteneur du menu
               var popup = canvas.append("div")
                  .attr("class", "context-menu")
                  .style("left", mousePosition[0] + "px")
                  .style("top", mousePosition[1] + "px")
                  .style("border", "1px solid")
                  .on('contextmenu', removeContextMenu);

               // Construction du menu et des options
               var menuList = popup.append("ul").attr("class", "context-menu-list");
               var menuItem;

               // -- Cas d'un click sur un noeud
               if (target.classed("node")) {
                  if (data.group) {
                     menuList.append("li").attr("class", "context-menu-item")
                        .on("click", menuDisaggregateNode)
                        .append("span").text("Eclater le groupe");
                  } else {
                     //Expand node
                     menuList.append("li").attr("class", "context-menu-item")
                        .on("click", menuExpandNode)
                        .append("span").text("Développer/réduire le noeud");
                  }
                  // get node relation
                  menuList.append("li").attr("class", "context-menu-item")
                     .on("click", menuGetLink)
                     .append("span").text("Afficher les relations du noeud");

                  // Path to this node
                  menuItem = menuList.append("li").attr("class", "context-menu-item");
                  if (data.group) {
                     menuItem.text("Chemins vers ce noeud").style("color", "#696969");;
                  } else {
                     menuItem.on("click", menuPathToNode)
                        .append("span").text("Chemins vers ce noeud");
                  }

                  //Path from this node
                  menuItem = menuList.append("li").attr("class", "context-menu-item");
                  if (data.group) {
                     menuItem.append("span").text("Chemins depuis ce noeud").style("color", "#696969");;;
                  } else {
                     menuItem.on("click", menuPathFromNode)
                        .append("span").text("Chemins depuis ce noeud");
                  }


                  menuList.append("li").attr("class", "context-menu-item context-menu-separator not-selectable");
               }

               // -- Cas d'un click sur un lien
               if (target.classed("link")) {
                  menuList.append("li").attr("class", "context-menu-item")
                     .on("click", menuShowLinkInfo)
                     .append("span").text("Afficher les informations sur la relation");

                  menuList.append("li").attr("class", "context-menu-item context-menu-separator not-selectable");
               }

               // -- Cas normal
               // Regrouper des noeuds
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               var selected = false;
               selected = undefined != getSelectedNode();
               if (selected) selected = getSelectedNode().split(";").length > 1;
               if (selected) {
                  menuItem.on("click", menuGroupNode);
                  menuItem.append("span").text("Regrouper les noeuds");
               } else {
                  menuItem.append("span").text("Regrouper les noeuds").style("color", "#696969");
               }

               // Montrer/cacher les noeuds d'extrémité
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               if (endNodeShowed) {
                  menuItem.on("click", menuHideEndNode)
                     .append("span").text("Cacher les noeuds d'extrémité");
               } else {
                  menuItem.on("click", menuShowEndNode)
                     .append("span").text("Afficher les noeuds d'extrémité");
               }


               // Etendre le graphe d'un niveau
               menuList.append("li").attr("class", "context-menu-item")
                  .on("click", menuExpandGraph)
                  .append("span").text("Développer le graphe d'un niveau");

               menuList.append("li").attr("class", "context-menu-item context-menu-separator not-selectable");

               // Rechercher les inter
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               if (getSelectedNode()) {
                  menuItem.on("click", menuShowInter)
                     .append("span").text("Rechercher les relations communes");
               } else {
                  menuItem.append("span").text("Rechercher les relations communes").style("color", "#696969");
               }

               // Rechercher les unions
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               if (getSelectedNode()) {
                  menuItem.on("click", menuShowUnion)
                     .append("span").text("Rechercher toutes les relations");
               } else {
                  menuItem.append("span").text("Rechercher toutes les relations").style("color", "#696969");
               }

               menuList.append("li").attr("class", "context-menu-item context-menu-separator not-selectable");

               // Sauvegarde du SVG
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               menuItem.on("click", menuSaveSVG)
                  .append("span").text("Sauvegarder le graphique (SVG)");

               menuItem = menuList.append("li").attr("class", "context-menu-item");
               menuItem.on("click", menuSavePNG)
                  .append("span").text("Sauvegarder le graphique (PNG)");

               // Sauvegarde du JSON
               menuItem = menuList.append("li").attr("class", "context-menu-item");
               menuItem.on("click", menuSaveJSON)
                  .append("span").text("Sauvegarder le graphique (données)");

               //	menuList.append("li").attr("class", "context-menu-item icon icon-test").on("click", function(){console.log("Test");})
               //	.append("span").text("Test");


               // Combine pour que le menu ne dépasser pas du cadre du graph.
               var canvasSize = [
                  d3.select("body").node().offsetWidth,
                  d3.select("body").node().offsetHeight
               ];

               var popupSize = [
                  popup.node().offsetWidth,
                  popup.node().offsetHeight
               ];

               if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
                  popup.style("left", "auto");
                  popup.style("right", 0);
               }

               if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
                  popup.style("top", "auto");
                  popup.style("bottom", 0);
               }


               contextMenu = true;
               //	console.log(target);
               //	console.log(data);

            }

            /**
             *
             */
            /*function removeContextMenu(){
               d3.select(".context-menu").remove();
               contextMenu=false;
               data = undefined;
               d3.event.preventDefault();
            }*/

            //------------------- CallBack -------------------\\

            /**
             *
             */
            function menuGroupNode() {
               //	console.log("Regrouper les noeuds");

               // On crée un nouveau noeuds qui représentera
               // le groupe de noeuds
               var group = new Object();
               group.id = graph.group.length;
               group.index = graph.node.length;
               group.key = "GROUP-" + graph.groupId++;
               group.x = width / 2;
               group.y = height / 2;
               group.visible = true;
               group.expanded = true;
               group.selected = false;
               group.group = new Array();
               group.children = new Array();

               // On récupère tous les noeuds qui sont selectionnés :
               // - on les ajoutes dans le groupe
               // - on les rend invisible
               // - on les déselectionne
               var selectedNodes = getSelectedNode().split(";");
               selectedNodes.forEach(function(key) {
                  var node = graph.node[map[key]];
                  node.visible = false;
                  node.selected = false;
                  node.fixed = false;
                  node.inGroup = group.id;
                  if (group.father) {
                     if (group.father.level > node.father.level)
                        group.father = node.father;
                  } else
                     group.father = node.father;

                  group.group.push(node);
               });

               if (group.father.children)
                  group.father.children.push(group);

               // On crée les liens correspondant au noeuds faisant partie du groupe
               // Ne sont ajouter que les liens qui ne sont pas interne au groupe.
               graph.link.forEach(function(link) {
                  // indiquateur pour les liens qui contiennent un des noeuds sélectionner
                  // en source ou cible
                  var source = false;
                  var target = false;
                  // Nouveau liens calqué sur le
                  var newLink = new Object();
                  newLink.index = graph.link.length;
                  newLink.from = link.from;
                  newLink.to = link.to;
                  newLink.lastFrom = link.lastFrom;
                  newLink.lastTo = link.lastTo;
                  newLink.source = link.source;
                  newLink.target = link.target;
                  newLink.pathId = link.pathId;

                  selectedNodes.forEach(function(key) {
                     if (link.source.key == key) source = true;
                     if (link.target.key == key) target = true;
                  });

                  if (source || target) {
                     link.visible = false;
                  }

                  if (source) {
                     newLink.source = group;
                  }

                  if (target) {
                     newLink.target = group;
                  }

                  if (!(source ^ target)) return;

                  newLink.visible = newLink.source.visible && newLink.target.visible;


                  addLink(newLink, true);

               });


               // On ajoute le noeud groupe au graph.
               map[group.key] = group.index;
               graph.group.push(group);
               graph.node.push(group);

               update();

               //alert("Not implemented");
               menuEndCallBack();
            }


            function menuDisaggregateNode() {
               var node = datas;
               node.group.forEach(function(n) {
                  n.visible = true;
               });
               node.visible = false;

               // Afficher masquer les liens.
               graph.link.forEach(function(link) {
                  if (!(link.target.visible && link.source.visible)) {
                     link.visible = false;
                  } else {
                     link.visible = true;
                  }
               });

               removeGroup(node);

               update();

               menuEndCallBack();
            }

            /**
             *
             */
            function menuHideEndNode() {
               console.log("Cacher/Montrer les noeuds d'extrémité");
               // Remise à zéro de la liste des noeuds d'extrémité.
               arrayEndNode = [];
               var nbRelation = {};

               graph.link.forEach(function(link) {
                  //source
                  var count = nbRelation[link.source.index];
                  if (count) {
                     count++;
                     nbRelation[link.source.index] = count;
                  } else {
                     nbRelation[link.source.index] = 1;
                  }
                  //target
                  count = nbRelation[link.target.index];
                  if (count) {
                     count++;
                     nbRelation[link.target.index] = count;
                  } else {
                     nbRelation[link.target.index] = 1;
                  }
               });



               graph.node.forEach(function(node) {
                  // On cherche tous les noeuds qui ont moins de
                  // 2 relations, qui ne sont pas des groupes et
                  // qui ne sont pas de niveau zéro.
                  var count = nbRelation[node.index];
                  if ((count < 2) && (undefined == node.group) &&
                     (node.level != 0) && (undefined == node.inGroup)) {
                     arrayEndNode.push(node);
                  }
               });


               arrayEndNode.forEach(function(endNode) {
                  endNode.visible = false;
               });

               console.log(arrayEndNode);

               //	graph.node.forEach(function(n){
               //		if(n.children){
               //			if(0 == n.children.length && !(n.group))
               //				n.visible = false;
               //		}else{
               //			n.visible = false;
               //		}
               //	});

               // On fait disparaitre les relations qui contiennent un
               // noeud qui n'est pas visible. Les autres sont rendu visible.
               graph.link.forEach(function(link) {
                  if (!(link.target.visible && link.source.visible)) {
                     link.visible = false;
                  }
               });

               update();
               endNodeShowed = true;
               //menuEndCallBack();
            }


            $scope.hideEndNode = function() {

               menuHideEndNode();
               //console.log('active');

            }
            $scope.showEndNode = function() {

               menuShowEndNode();
               //console.log('active');

            }

            $scope.ExpendNode = function() {

               menuExpandGraph();
               //console.log('active');

            }

            function menuShowEndNode() {

               arrayEndNode.forEach(function(endNode) {
                  if (endNode.father.visible)
                     endNode.visible = true;
               });

               //	graph.node.forEach(function(n){
               //		if(n.children){
               //			expand(n, n.index);
               //		}
               //	});

               // On fait disparaitre les relations qui contiennent un
               // noeud qui n'est pas visible. Les autres sont rendu visible.
               graph.link.forEach(function(link) {
                  if (!(link.target.visible && link.source.visible)) {
                     link.visible = false;
                  } else {
                     link.visible = true;
                  }
               });

               update();
               endNodeShowed = true;
               //menuEndCallBack();
            }

            /**
             *
             */
            function menuExpandGraph() {
               //	console.log("Développer le graphe d'un niveau");
               graph.node.forEach(function(n) {
                  expand(n, n.index);
               });

               //menuEndCallBack();
            }

            /**
             *
             */
            function menuShowInter() {
               //	console.log("Rechercher les relations communes");

               // On récupère tous les noeuds qui sont selectionnés
               var selectedNodes = getSelectedNode().split(";");


               // On construit l'url
               var url = "json?cmd=inter";
               var searchField = "";
               selectedNodes.forEach(function(n) {
                  if ("" !== searchField) {
                     searchField += ";";
                  }
                  var node = graph.node[map[n]];
                  if (node.group) {
                     var nodesInGroup = getNodeInGroup(node);
                     nodesInGroup.forEach(function(nodeInGroup) {
                        url += "&node=" + nodeInGroup.key;
                        if ("" !== searchField) {
                           searchField += ";";
                        }
                        searchField += nodeInGroup.key;
                     });
                  } else {
                     url += "&node=" + n;
                     searchField += n;
                  }
               });

               // On purge le graphe
               graph = new Object();
               graph.node = new Array();
               graph.link = new Array();
               graph.group = new Array();
               // On vide la map
               map = new Object();

               loadJsonFromUrl(url);

               d3.select("#relationNode").property("value", searchField);

               menuEndCallBack();
            }

            /**
             *
             */
            function menuShowUnion() {
               //	console.log("Rechercher toutes les relations");

               // On récupère tous les noeuds qui sont selectionnés
               var selectedNodes = getSelectedNode();
               // On construit l'url
               var url = "json?cmd=union";
               selectedNodes.split(";").forEach(function(n) {
                  url += "&node=" + n;
               });

               // On purge le graphe
               graph = new Object();
               graph.node = new Array();
               graph.link = new Array();
               graph.group = new Array();
               // On vide la map
               map = new Object();


               loadJsonFromUrl(url);

               d3.select("#relationNode").property("value", selectedNodes);

               menuEndCallBack();
            }

            /**
             *
             */
            function menuExpandNode() {
               var node = datas;
               if (node.expanded) {
                  collapse(node, node.index);
               } else {
                  expand(node, node.index);
               }
               //menuEndCallBack();
            }

            /**
             *
             */
            function menuGetLink() {
               var node = datas;
               var url;
               var value = "";
               if (node.group) {
                  url = "json?cmd=inter";
                  node.group.forEach(function(n) {
                     url += "&node=" + n.key;
                     value += n.key + ";";
                  });
               } else {
                  url = "json?cmd=relation&node=" + node.key;
                  value = node.key;
               }

               cmd = "relation";

               // On purge le graphe
               graph = new Object();
               graph.node = new Array();
               graph.link = new Array();
               graph.group = new Array();
               // On vide la map
               map = new Object();

               json = datas;
               //loadJsonFromUrl(url);


               d3.selectAll("#searchType").each(function(d) {
                  if (d3.select(this).attr("value") == "relation")
                     d3.select(this).property("checked", true);
               });

               d3.select("#relation").style("display", "block");
               d3.select("#path").style("display", "none");

               d3.select("#relationNode").property("value", value);
               d3.select("#startNode").property("value", value);

               menuEndCallBack();
            }

            /**
             *
             */
            function menuPathToNode() {
               var node = data;


               d3.selectAll("#searchType").each(function(d) {
                  if (d3.select(this).attr("value") == "path")
                     d3.select(this).property("checked", true);
               });

               d3.select("#relation").style("display", "none");
               d3.select("#path").style("display", "block");

               d3.select("#endNode").property("value", "");
               d3.select("#endNode").property("value", node.key);
               menuEndCallBack();
            }

            /**
             *
             */
            function menuPathFromNode() {
               var node = data;

               d3.selectAll("#searchType").each(function(d) {
                  if (d3.select(this).attr("value") == "path")
                     d3.select(this).property("checked", true);
               });

               d3.select("#relation").style("display", "none");
               d3.select("#path").style("display", "block");

               d3.select("#startNode").property("value", "");
               d3.select("#startNode").property("value", node.key);
               menuEndCallBack();
            }

            function menuShowLinkInfo() {
               //alert("Not implemented");
               var link = datas;
               linkClick(link);
               showLinkInformation(link);
               menuEndCallBack();
            }

            /**
             * Sauvegarde du fichier SVG.
             */
            function menuSaveSVG() {
               //	alert("Not implemented");
               var svgElement = d3.select("svg").node();
               var svgString = new XMLSerializer().serializeToString(svgElement);

               //JQuery style !
               var form = document.getElementById("svgform");
               form['outputFormat'].value = "svg";
               form['svgData'].value = svgString;

               form.submit();

               menuEndCallBack();
            }


            /**
             * Sauvegarde du fichier PNG.
             */
            function menuSavePNG() {
               //	alert("Not implemented");
               var svgElement = d3.select("svg").node();
               var svgString = new XMLSerializer().serializeToString(svgElement);

               //JQuery style !
               var form = document.getElementById("svgform");
               form['outputFormat'].value = "png";
               form['svgData'].value = svgString;

               form.submit();

               menuEndCallBack();
            }

            /**
             * Sauvegarde des données du graph.
             */
            function menuSaveJSON() {
               //	alert("Not implemented");

               //JQuery style !
               var form = document.getElementById("svgform");
               form['outputFormat'].value = "json";
               form['svgData'].value = stringify(graph, null, "  ");

               form.submit();


               menuEndCallBack();
            }

            /**
             * Arrêt du call back.
             */
            /*function menuEndCallBack(){
               removeContextMenu();
               lastTarget = undefined;
            }*/

            /* *****************************************************************
             *						Model function
             **************************************************************** */

            /**
             * Function that return a String containing a list of selected nodes
             * separate by a semicolon, or undefined if no nodes were selected.
             * @returns String containing the name of selected node or <code>undefined</code>
             */
            function getSelectedNode() {
               var selectedNode = undefined;

               graph.node.forEach(function(node) {
                  if (node.selected) {
                     if (selectedNode) {
                        selectedNode += ";" + node.key;
                     } else {
                        selectedNode = node.key;
                     }

                  }
               });

               return selectedNode;
            }

            /**
             * Récupère l'index du groupe auquel appartient le noeud
             * passé en paramètre, si il n'appartient pas à un noeud
             * l'index renvoyé est celui du noeud.
             * @param node le noeud.
             * @returns {Number}
             */
            function getGroupIndex(node) {
               var index;
               if (node.inGroup) {
                  var groupNode = graph.group[oldNode.inGroup];
                  index = getGroupIndex(groupNode);
               } else {
                  index = node.index;
               }
               return index;
            }

            /**
             * Supprime un group des données du graph.
             * @param group le group à supprimer.
             */
            function removeGroup(group) {
               //	console.log("Remove group : ");console.log(group);
               // On supprime le group des données du graph
               graph.group.splice(group.id, 1);

               // On réagence les données de groupe et notamment les ID.
               for (var i = 0; i < graph.group.length; i++) {
                  var g = graph.group[i];
                  g.id = i;
                  g.group.forEach(function(node) {
                     node.inGroup = g.id;
                  });
               }

               // On indique au noeud composant le groupe qu'il ne sont plus dans un group.
               group.group.forEach(function(node) {
                  node.inGroup = undefined;
               });

               // On supprime le groupe des "enfants" de son "père"
               var children = group.father.children;
               if (children)
                  children.splice(children.indexOf(group), 1);

               // On supprime le group des données du graph (node)
               removeNode(group);
            }

            /**
             * Supprime un noeud des données du graph.
             * @param node le noeud à supprimer
             */
            function removeNode(node) {
               //	console.log("Remove node : ");console.log(node);

               // Suppression du noeud de la Map
               delete map[node.key];
               // Suppression du noeud des données de graph.
               graph.node.splice(node.index, 1);
               //Réagencement des noeuds
               for (var i = node.index; i < graph.node.length; i++) {
                  var n = graph.node[i];
                  n.index = i;
                  map[n.key] = i;
               }

               // On supprime tous les liens vers ou à partir de ce noeud.
               var linkToRemove = new Array();
               graph.link.forEach(function(link) {
                  if ((link.source.key == node.key) || (link.target.key == node.key)) {
                     linkToRemove.push(link);
                  }
               });
               // suppression des liens
               linkToRemove.forEach(removeLink);

            }

            /**
             * Supprime un lien des données du graph
             * @param link le lien à supprimer
             */
            function removeLink(link) {
               //	console.log("Remove link : ");console.log(link);
               // Suppression du lien
               graph.link.splice(link.index, 1);
               // Réagencement des liens.
               mapLink = new Object();
               for (var i = 0; i < graph.link.length; i++) {
                  var l = graph.link[i];
                  l.index = i;
                  var key = l.source.index + "-" + l.target.index;
                  mapLink[key] = l.index;
               };
            }

            /**
             * Ajoute un lien au graph, si le lien est déjà présent deux solutions :
             *  fusion = true : On fusionne les deux liens
             *  fusion = false : On ne fusionne pas les deux liens, l'opération est avorté
             * @param {CortexLink} link le lien à ajouter.
             * @param {Boolean} fusion indique si le lien à ajouter sera fusionné avec un lien déjà existant
             * @returns {Boolean} <code>true</code> si le lien est ajouté (ou fusionné);
             * <code>false</code> dans le cas contraire.
             */
            function addLink(link, fusion) {
               var ret = false;

               var inverted = false;

               // On récupère les direction possible des noeuds
               var key, key_inv;
               if (typeof link.source == "number") {
                  key = link.source + "-";
                  key_inv = "-" + link.source;
               } else {
                  key = link.source.index + "-";
                  key_inv = "-" + link.source.index;
               }


               if (typeof link.target == "number") {
                  key += link.target;
                  key_inv = link.target + key_inv;
               } else {
                  key += link.target.index;
                  key_inv = link.target.index + key_inv;
               }

               var oldLink = undefined;

               // On regarde si il n'y a pas de
               if (mapLink[key]) oldLink = graph.link[mapLink[key]];
               // Dans le sens inverse
               else if (mapLink[key_inv]) {
                  oldLink = graph.link[mapLink[key_inv]];
                  inverted = true;
               }

               // Si le lien existe déjà
               if (undefined != oldLink) {
                  // fusion des deux lien ?
                  if (fusion) {
                     ret = fusionLink(oldLink, link, inverted);
                  }
                  // Sinon on ajoute juste les pathId
                  else if (undefined != link.pathId) {
                     if (undefined == oldLink.pathId) {
                        oldLink.pathId = new Array();
                     }

                     link.pathId.forEach(function(id) {
                        if (-1 == oldLink.pathId.indexOf(id)) {
                           oldLink.pathId.push(id);
                        }
                     });
                  }
               }
               //Sinon on ajoute le lien au graph.
               else {
                  link.index = graph.link.length;
                  graph.link.push(link);
                  mapLink[key] = link.index;
                  ret = true;
               }

               return ret;
            }

            /**
             * Fusion le lien A et le lien B. Le résultat de la fusion est stoké dans
             * le lien A.
             * @param {CortexLink} linkA lien à fusionner dans lequel le résultat de la fusion est stoké
             * @param {CortexLink} linkB lien à fusionner.
             * @param {Boolean} inverted indicateur d'inversion de sens du lien B;
             * @return {Boolean}
             */
            function fusionLink(linkA, linkB, inverted) {
               var ret = false;

               if (inverted) {
                  linkA.to += linkB.from;
                  linkA.from += linkB.to;
               } else {
                  linkA.to += linkB.to;
                  linkA.from += linkB.from;
               }

               if (undefined != linkB.pathId) {
                  if (undefined == linkA.pathId) {
                     linkA.pathId = new Array();
                  }

                  linkB.pathId.forEach(function(id) {
                     if (-1 == linkA.pathId.indexOf(id)) {
                        linkA.pathId.push(id);
                     }
                  });
               }

               ret = true;

               return ret;
            }

            /**
             * Renvoie tous les noeuds qui compose le groupe, y compris les noeuds qui
             * composent les groups inclus.
             * @param nodeGroup le group dont on souhaite récupérer les noeuds
             * @returns {Array} liste des noeuds
             */
            function getNodeInGroup(nodeGroup) {
               var nodes = new Array;

               if (nodeGroup.group == undefined) return nodes;

               nodeGroup.group.forEach(function(node) {
                  if (node.group) {
                     var nodesBis = getNodeInGroup(node);
                     nodes.push(nodesBis);
                  } else {
                     nodes.push(node);
                  }
               });

               return nodes;
            }


            /**
             * Renvoie un String représentant le graph (JSON).
             * @param graph le graph.
             * @returns {String} une chaine de caractère représentant le graph (JSON)
             */
            function stringify(graph, replacer, indent) {
               var string = "";

               var printedObject = [];
               var printedObjectKeys = [];

               function printOnceReplacer(key, value) {
                  if (printedObject.length > 2000) { // limite du cache !
                     return "graph too big";
                  }
                  //		var printedObjIndex = false;
                  //		printedObject.forEach(function(obj, index){
                  //			if(obj === value){
                  //				printedObjIndex = index;
                  //			}
                  //		});

                  if (key == '') { // root element
                     printedObject.push(graph);
                     printedObjectKeys.push("root");
                     return value;
                  } else if (key == 'children') {
                     var children = new Array();
                     value.forEach(function(child) {
                        children.push(child.index);
                     });
                     return children;
                  } else if ((key == 'father') && (value !== undefined)) {
                     return value.index;
                  } else if (key == 'source') {
                     return value.index;
                  } else if (key == 'target') {
                     return value.index;
                  } else if (key == 'group') {
                     var group = new Array();
                     value.forEach(function(node) {
                        group.push(node.index);
                     });
                     return group;
                  }
                  //		else if( (printedObjIndex + "" != "false") && (typeof(value) == "object") ){
                  //			if( printedObjectKeys[printedObjIndex] == "root"){
                  //				return "(pointer to root)";
                  //			}
                  //			else{
                  //				return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() :
                  //					typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
                  //			}
                  //		}
                  else {
                     var qualifiedKey = key || ("empty key");
                     printedObject.push(value);
                     printedObjectKeys.push(qualifiedKey);
                     if (replacer) {
                        return replacer(key, value);
                     } else {
                        return value;
                     }
                  }
               }

               string = JSON.stringify(graph, printOnceReplacer, indent);

               return string;
            }

            /*
             * Ce fichier est la propriété de Ercom (c)
             * Toute reproduction et/ou divulgation est strictement interdite.
             *
             * This file is the property of Ercom (c)
             * Any reproduction and/or disclosure is prohibited.
             *
             */


            /*-----------------------------------------------------------------
            * 							CortexNode
            ----------------------------------------------------------------*/

            /**
             * Constructeur de la classe <code>CortexNode</code>.
             * @param key Clé du noeud
             * @param id l'index du noeud
             * @param type le type de noeud
             * @param level le niveau du noeud
             */
            function CortexNode(key, id, type, level) {
               this.key = key;
               this.id = id;
               this.type = type;
               this.level = level;
            }
            /** Chaine de caractère représentant le noeud. */
            CortexNode.prototype.key = "";
            /** Identifiant du noeud. */
            CortexNode.prototype.id = -1;
            /** Entier représentant le type du noeud. */
            CortexNode.prototype.type = -1;
            /** Entier représentant le niveau du noeud. */
            CortexNode.prototype.level = 999;
            /** Indicateur de visibilité.*/
            CortexNode.prototype.visible = true;
            /** Indicateur de développement.*/
            CortexNode.prototype.expanded = false;
            /** Indicateur de sélection.*/
            CortexNode.prototype.selected = false;
            /** Indicateur de fixation.*/
            CortexNode.prototype.fixed = false;
            /** Indicateur de group. */
            CortexNode.prototype.isGroup = false;
            /** Père du noeud.*/
            CortexNode.prototype.father = undefined;
            /** Tableau contenant les fils du noeud. */
            CortexNode.prototype.children = new Array();
            /** Index du group auquel appartient le noeud. */
            CortexNode.prototype.inGroup = -1;
            /** Image liée au noeud. */
            CortexNode.prototype.img = "";


            /*-----------------------------------------------------------------
            * 							CortexGroup
            ----------------------------------------------------------------*/


            /**
             * Constructeur d'un group.
             * @param {Number} id l'identifiant du group
             * @param {Array} nodes un tableau de noeud compris dans le groupe
             */
            function CortexGroup(id, nodes) {
               CortexNode.apply(this, ["GROUP-" + id, id, 999, 999]);
               this.id = id;
               this.group = new Array();
               var tempGroup = new Array();
               nodes.forEach(function(node) {
                  node.visible = false;
                  node.selected = false;
                  node.inGroup = id;
                  if (this.father) {
                     if (this.father.level > node.father.level)
                        this.father = node.father;
                  } else {
                     this.father = node.father;
                  }

                  //		if(node.children.length != 0){
                  //			//XXX
                  //		}

                  tempGroup.push(node);
               });

               this.group.push(tempGroup);

               if (undefined === this.father) return;

               if (this.father.children)
                  this.father.children.push(this);
            }

            /** Indicateur de group. */
            CortexGroup.prototype.isGroup = true;
            /** Tableau contenant les noeuds composant le groupe. */
            CortexGroup.prototype.group = new Array();
            /** Héritage de CortexNode. */
            CortexGroup.prototype = new CortexNode();


            /*-----------------------------------------------------------------
            * 							CortexLink
            ----------------------------------------------------------------*/

            /**
             * Constructeur.
             * @param {Number} index l'index de la relation
             * @param {Number} from count from
             * @param {Number} to count to
             * @param {String} lastFrom date dernier from
             * @param {String} lastTo date dernier to
             * @param {Object} source id de la source ou l'objet source
             * @param {Object} target id de la cible ou l'objet cible
             * @param {Array} pathId tableau contenant les identifiants des chemins auquel appartient la relation
             */
            function CortexLink(index, from, to, lastFrom, lastTo, source, target, pathId) {
               this.index = index;
               this.from = from;
               this.to = to;
               this.lastFrom = lastFrom;
               this.lastTo = lastTo;
               this.source = source;
               this.target = target;
               this.pathId = pathId;
            }

            /** Indicateur de metalink. */
            CortexLink.prototype.isMetaLink = false;
            /** Indicateur de surlignage. */
            CortexLink.prototype.isHighlighted = false;

            /**
             * Renvoie la direction sous la forme d'une chaine de caractères
             * de type "<i>sourceIndex</i>-<i>targetIndex</i>".
             * @returns {String}
             */
            CortexLink.prototype.getDirection = function() {
               var direction = "";
               if (typeof this.source == "number")
                  direction = this.source;
               else
                  direction = this.source.index;

               direction += "-";

               if (typeof this.target == "number")
                  direction += this.target;
               else
                  direction += this.target.index;

               return direction;
            };

            /**
             * Renvoie la direction inversé sous la forme d'une chaine de caractères
             * de type "<i>targetIndex</i>-<i>sourceIndex</i>".
             * @returns {String}
             */
            CortexLink.prototype.getDirectionInverse = function() {
               var direction = "";
               if (typeof this.target == "number")
                  direction = this.target;
               else
                  direction = this.target.index;

               direction += "-";

               if (typeof this.source == "number")
                  direction += this.source;
               else
                  direction += this.source.index;

               return direction;
            };


            /*-----------------------------------------------------------------
            * 							CortexMetaLink
            ----------------------------------------------------------------*/

            /**
             * Meta lien, créé par l'utilisateur.
             * @param {Number} index
             * @param {Object} source
             * @param {Object} target
             */
            function CortexMetaLink(index, source, target) {
               this.index = index;
               this.source = source;
               this.target = target;
            }

            /** Indicateur de metalink. */
            CortexMetaLink.prototype.isMetaLink = true;

            /** Heritage de CortexLink.*/
            CortexMetaLink.prototype = new CortexLink();


         });


   }
]);
