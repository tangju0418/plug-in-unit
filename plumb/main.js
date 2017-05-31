(function(){
	var nodeDataArray = [
		{ key: 1, category:"Start", "loc":"0 240", text: "start", shape: "Ellipse", color: "brown" },
    { key: 2, category:"", "loc":"150 200", text: "question1", shape: "Diamond", color: "slateblue" },
    { key: 3, category:"Action", "loc":"330 280", text: "action1", shape: "Rectangle", color: "orange" },
    { key: 4, category:"", "loc":"350 100", text: "question2", shape: "Diamond", color: "slateblue" },
    { key: 5, category:"End", "loc":"430 450",text: "dosomething", shape: "auto", color: "aquamarine" },
    { key: 6, category:"Action", "loc":"700 250", text: "action2", shape: "Rectangle", color: "orange" },
    { key: 7, category:"End", "loc":"650 400", text: "dosomething",shape: "auto", color: "aquamarine" }
	];
	var linkDataArray = [
		{ from: 1, to: 2},
    { from: 2, to: 3, text: "yes" },
    { from: 2, to: 4, text: "no" },
    { from: 3, to: 5, text: "dosomething" },
    { from: 4, to: 6, text: "yes" },
    { from: 6, to: 5, text: "yes" },
    { from: 6, to: 7, text: "no"}
	];
	var $ = go.GraphObject.make;
	var myDiagram =
  	$(go.Diagram, "myDiagramDiv",
    {
      initialContentAlignment: go.Spot.Center,
      allowDrop: true,  
      "undoManager.isEnabled": true,
      "toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
    });
  //节点
  myDiagram.nodeTemplateMap.add("",  // the default category
    $(go.Node, "Spot", nodeStyle(),
      nodeBg('Diamond'),
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("Start",  // the Start category
    $(go.Node, "Spot", nodeStyle(),
      nodeBg('Ellipse'),
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("End",  // the End category
    $(go.Node, "Spot", nodeStyle(),
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("Action",  // the Action category
    $(go.Node, "Spot", nodeStyle(),
      nodeBg('Rectangle'),
      nodeTemplate()
  ));

	//连线
	myDiagram.linkTemplate =
	  $(go.Link,
	    { routing: go.Link.AvoidsNodes, corner: 5 },
	    $(go.Shape, { strokeWidth: 2, stroke: "#ca221f" }),
	    $(go.Shape,  {
	    	toArrow:'OpenTriangle',
	    	fill:null, 
	    	stroke: "#ca221f",
	    	strokeWidth:2 }),
	    $(go.Panel, "Auto",
          $(go.Shape, { fill: "#fff",strokeWidth:0 }),
          $(go.TextBlock, "?", {
           		margin: 5 ,
           		editable: true
       		},
          new go.Binding("text")),
          new go.Binding("segmentIndex").makeTwoWay(),
          new go.Binding("segmentFraction").makeTwoWay()
        ),
       new go.Binding("show",'from',function(v){return v != 1}),
	); 

	myDiagram.model = new go.GraphLinksModel(nodeDataArray,linkDataArray)

	//调色板
	var myPalette =
    $(go.Palette, "myPaletteDiv",  
      {
        nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
        model: new go.GraphLinksModel([ 
        { category:"", text: "Question", shape: "Diamond", color: "slateblue" },
        { category:"Action", text: "Action", shape: "Rectangle", color: "orange" },
        { category:"End", text: "Output",shape: "auto", color: "aquamarine" }
        ])
      });


  //概述图
	var myOverview =
    $(go.Overview, "myOverviewDiv",
      { observed: myDiagram });

  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        locationSpot: go.Spot.Center,
        mouseEnter: function (e, obj) { showPorts(obj.part, true); },
        mouseLeave: function (e, obj) { showPorts(obj.part, false); }
      }
    ];
  }

  function nodeBg( shape) {
    return $(go.Shape, shape,
        { 
          stroke: null,
          alignment:go.Spot.Center,
          desiredSize: new go.Size(100, 100),
          fromLinkable: true, 
          toLinkable: true,
          cursor: "pointer",
          fill: "#ddd",
          portId: 'nodeBg'
        },
        new go.Binding("fromLinkable", "category", function(v) { return (v != 'Start' && v != 'End')}),
        new go.Binding("toLinkable", "category", function(v) { return v != 'Start'}),
      )
    
  }

  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
      port.fill = (show ? "#aaa" : '#ddd');
    });
  }

  function nodeTemplate(){
    return [
      $(go.Panel, "Auto",
        $(go.Shape, 
          { 
            desiredSize: new go.Size(80, 80),
            cursor: "move",
            fill: "lightblue"
          },
          new go.Binding("figure", "shape"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
         "Default Text", 
         { 
           text:"textAlign:'center'",
           margin: 6, 
           stroke: "black", 
           font: "bold 14px sans-serif" ,
           // wrap:go.TextBlock.WrapFit,
           editable: true
          },
           new go.Binding("text").makeTwoWay()
        )
      )
    ];
  }
})()