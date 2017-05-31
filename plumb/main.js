(function(){
	var nodeDataArray = [
		{ key: 1, category:"Start", "loc":"0 240", "size":"80,80", text: "start", shape: "Ellipse", color: "brown" },
    { key: 2, category:"", "loc":"150 200","size":"80,80", text: "question1", shape: "Diamond", color: "slateblue" },
    { key: 3, category:"Action", "loc":"330 280","size":"80,80", text: "action1", shape: "Rectangle", color: "orange" },
    { key: 4, category:"", "loc":"350 100","size":"80,80", text: "question2", shape: "Diamond", color: "slateblue" },
    { key: 5, category:"End", "loc":"430 450","size":"80,80",text: "dosomething", shape: "auto", color: "aquamarine" },
    { key: 6, category:"Action", "loc":"700 250","size":"80,80", text: "action2", shape: "Rectangle", color: "orange" },
    { key: 7, category:"End", "loc":"650 400","size":"80,80", text: "dosomething",shape: "auto", color: "aquamarine" }
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
       // resizingTool: new ResizeMultipleTool(),
      "toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
    });
  var nodeResizeAdornmentTemplate =
    $(go.Adornment, "Spot",
      { locationSpot: go.Spot.Right },
      $(go.Placeholder),
      $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      // $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

      // $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      // $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

      $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      // $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
    );

  //节点
  myDiagram.nodeTemplateMap.add("",  // the default category
    $(go.Node, "Spot", nodeStyle(),
      // { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
      { selectionObjectName: "PANEL" },
      nodeBg('Diamond'),
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("Start",  // the Start category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL" },
      nodeBg('Ellipse'),
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("End",  // the End category
    $(go.Node, "Spot", nodeStyle(),
      // { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
      { selectionObjectName: "PANEL" },
      nodeTemplate()
  ));
  myDiagram.nodeTemplateMap.add("Action",  // the Action category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL" },
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

  myDiagram.nodeTemplate.selectionAdornmentTemplate =
    $(go.Adornment, "Spot",
      $(go.Panel, "Auto",
        // this Adornment has a rectangular blue Shape around the selected node
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: new go.Margin(4, 4, 0, 4) })
      ),
      // and this Adornment has a Button to the right of the selected node
      $("Button",
        {
          alignment: go.Spot.Right,
          alignmentFocus: go.Spot.Left,
          click: function(){alert(2);}  // define click behavior for this Button in the Adornment
        },
        $(go.TextBlock, "+",  // the Button content
          { font: "bold 8pt sans-serif" })
      )
    );

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
        mouseLeave: function (e, obj) { showPorts(obj.part, false); },
        
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
          portId: 'nodeBg',
        },
        // { name: "PANEL" },
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("fromLinkable", "category", function(v) { return (v != 'Start' && v != 'End')}),
        new go.Binding("toLinkable", "category", function(v) { return v != 'Start'}),
      )
    
  }

 

  function nodeTemplate(){
    return [
      $(go.Panel, "Auto",
        {click:function(e, obj){ showIcon(e,obj); }},
        { name: "PANEL" },
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
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
        ),
        
          
          $(go.Shape, "BpmnEventConditional",
            { 
              portId:'icon-edit',
              alignment:go.Spot.TopLeft,
              fill:"#fff",
              stroke: "#fff",
              margin:2,
              cursor: "pointer",
              desiredSize: new go.Size(18, 18),
              cursor: "move",
              fill: "lightblue",
              click:function(e,obj){operate(obj.part);}
            },
          ),
          $(go.Shape, "ThinX",
            { 
              portId:'icon-del',
              alignment:go.Spot.TopRight,
              fill:"#fff",
              stroke: "#fff",
              margin:2,
              cursor: "pointer",
              desiredSize: new go.Size(18, 18),
              cursor: "move",
              fill: "lightblue",
              click:function(e,obj){delNode(obj.part);}
            },
          ),
      
        
      ),

    ];
  }
  function showIcon(node){
    console.log(node)

  }
  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
      port.fill = (show ? "#aaa" : '#ddd');
    });
  }

  function operate(e, obj){
      
  }
  function delNode(node){
    myDiagram.remove(node);
  }
})()