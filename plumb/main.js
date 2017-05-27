(function(){
	var nodeDataArray = [
		{ key: 1, category:"Start", text: "start", shape: "Ellipse", color: "brown" },
    { key: 2, category:"", text: "question1", shape: "Diamond", color: "slateblue" },
    { key: 3, category:"Action", text: "action1", shape: "Rectangle", color: "orange" },
    { key: 4, category:"", text: "question2", shape: "Diamond", color: "slateblue" },
    { key: 5, category:"End",text: "dosomething", shape: "auto", color: "aquamarine" },
    { key: 6, category:"Action", text: "action2", shape: "Rectangle", color: "orange" },
    { key: 7, category:"End", text: "dosomething",shape: "auto", color: "aquamarine" }
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
      layout: $(go.ForceDirectedLayout,
              { 
              	defaultSpringLength: 50,
              	defaultElectricalCharge: 50 
              }),
    });
  //节点
	myDiagram.nodeTemplate =
		$(go.Node, "Auto",
			{ locationSpot: go.Spot.Center,
				// fromLinkable:true,
				// toLinkable:true
			},
			// new go.Binding("fromLinkable", "category", function(v) { return v != 'End'}),
			// new go.Binding("toLinkable", "category", function(v) { return v != 'Start'}),
			$(go.Shape,
	    	{	
	    		figure:'RoundedRectangle',
	    		cursor: "pointer",
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
		      wrap:go.TextBlock.WrapFit,
		      editable: true
		  },
		      new go.Binding("text")
		)
	);
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
        { text: "Question", shape: "Diamond", color: "slateblue" },
        { text: "Action", shape: "Rectangle", color: "orange" },
        { text: "Output",shape: "auto", color: "aquamarine" }
        ])
      });
  //概述图
	var myOverview =
    $(go.Overview, "myOverviewDiv",
      { observed: myDiagram });
})()