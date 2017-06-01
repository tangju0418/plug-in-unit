(function(){
  var btnConfirm = true
	var nodeDataArray = [
		{ key: 1, category:"Start",    "loc":"0 240",   "size":"80 80",   "bgSize":"100 100", text: "start",       shape: "Ellipse",   color: "brown" },
    { key: 2, category:"Question", "loc":"150 200", "size":"120 120", "bgSize":"140 140", text: "question1",   shape: "Diamond",   color: "slateblue" },
    { key: 3, category:"Action",   "loc":"330 280", "size":"80 80",   "bgSize":"100 100", text: "action1",     shape: "Rectangle", color: "orange" },
    { key: 4, category:"Question", "loc":"350 100", "size":"120 120", "bgSize":"140 140", text: "question2",   shape: "Diamond",   color: "slateblue" },
    { key: 5, category:"End",      "loc":"430 450", "size":"100 60",  "bgSize":"100 60",  text: "dosomething", shape: "auto",      color: "aquamarine" },
    { key: 6, category:"Action",   "loc":"700 250", "size":"80 80",   "bgSize":"100 100", text: "action2",     shape: "Rectangle", color: "orange" },
    { key: 7, category:"End",      "loc":"650 400", "size":"100 60",  "bgSize":"100 60",  text: "dosomething", shape: "auto",      color: "aquamarine" }
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

  var nodeResizeAdornmentTemplate =
    $(go.Adornment, "Spot",
      { locationSpot: go.Spot.Right },
      $(go.Placeholder),
      $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
    );

  //选中node显示button
  var nodeSelectionAdornmentTemplate = 
    $(go.Adornment, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder)
      ),
      // and this Adornment has two Button of the selected node
      $("Button",
        {
          cursor: "pointer",
          alignment: go.Spot.TopLeft,
          alignmentFocus: go.Spot.TopLeft,
          click:function(e,obj){editPanel(obj.part,'update');}  // define click behavior for this Button in the Adornment
        },
        $(go.Shape, "BpmnEventConditional",
          { 
            alignment:go.Spot.Center,
            fill:"#fff",
            stroke: "#000",
            desiredSize: new go.Size(14, 14),
          },
        )
      ),
      $("Button",
        {
          cursor: "pointer",
          alignment: go.Spot.TopRight,
          alignmentFocus: go.Spot.TopRight,
          click: function(e,obj){editPanel(obj.part,'del');}  // define click behavior for this Button in the Adornment
        },
        $(go.Shape, "ThinX",
          { 
            alignment:go.Spot.Center,
            fill:"#fff",
            stroke: "#000",
            desiredSize: new go.Size(14, 14),
          },
        )
      )
    );


  //按category分别建立节点
  myDiagram.nodeTemplateMap.add("Start",  // the Start category
    $(go.Node, "Spot",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        locationSpot: go.Spot.Center,
        mouseEnter: function (e, obj) { obj.part.ports.each(function(port) {
          port.fill = "#aaa"}); },
        mouseLeave: function (e, obj) { obj.part.ports.each(function(port) {
          port.fill = "#ddd"}); },
      },
      nodeBg('Ellipse'),
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("Question",  // the default category
    $(go.Node, "Spot", nodeStyle(),
      // { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
      nodeBg('Diamond'),
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("End",  // the End category
    $(go.Node, "Spot", nodeStyle(),
      // { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
      nodeBg('Rectangle'),
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("Action",  // the Action category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
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
          { category:"Action",   "size":"80 80",   "bgSize":"100 100", text: "Action",   shape: "Rectangle", color: "orange" },
          { category:"Question", "size":"120 120", "bgSize":"140 140", text: "Question", shape: "Diamond",   color: "slateblue" },
          { category:"End",      "size":"100 60",  "bgSize":"100 60",  text: "Output",   shape: "auto",      color: "aquamarine" }
        ])
      });


  //概述图
	var myOverview =
    $(go.Overview, "myOverviewDiv",
      { observed: myDiagram });

  //node的属性及方法
  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding("text").makeTwoWay(),
      {
        name: "PANEL" ,
        locationSpot: go.Spot.Center,
        mouseEnter: function (e, obj) { showPorts(obj.part, true); },
        mouseLeave: function (e, obj) { showPorts(obj.part, false); },
      }
    ];
  }

  //node用来增加连线的子面板
  function nodeBg( shape) {
    return $(go.Shape, shape,
        { 
          stroke: null,
          alignment:go.Spot.Center,
          fromLinkable: true, 
          toLinkable: true,
          cursor: "pointer",
          fill: "#ddd",
          portId: 'nodeBg',
        },
        // { name: "PANEL" },
        new go.Binding("desiredSize", "bgSize", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("fromLinkable", "category", function(v) { return (v != 'Start' && v != 'End')}),
        new go.Binding("toLinkable", "category", function(v) { return v != 'Start'}),
      )
    
  }

 
  //node展示内容的子面板
  function nodeTemplate(){
    return [
      $(go.Panel, "Auto",
        // { name: "PANEL" },
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.Shape, 
          { 
            cursor: "move",
            fill: "lightblue"
          },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          new go.Binding("cursor", "category",function(v){ return (v == 'Start' ? 'pointer' : 'move')}),
          new go.Binding("figure", "shape"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
         "Default Text", 
         { 
           text:"textAlign:'center'",
           margin: 6, 
           stroke: "black", 
           font: "bold 14px sans-serif" 
          },
           new go.Binding("text").makeTwoWay()
        )
        
      ),

    ];
  }

  //鼠标进入node，子面板颜色变化
  function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
      port.fill = (show ? "#aaa" : '#ddd');
    });
  }

  //编辑node的方法
  function editPanel(node, str){
    var editContent = document.getElementById("edit-content");
    var contentTitle = document.getElementById("content-title");
    var contentText = document.getElementById("content-text");
    var contentDel = document.getElementById("content-del");
    var btnCancel = document.getElementById("btn-cancel");
    var btnOk = document.getElementById("btn-ok");

    var oldNode = node.adornedPart

    if(str == 'del'){
      btnConfirm = true
    }else{
      btnConfirm = false
    }
    editContent.style.display = 'block';
    if( btnConfirm ){
      contentText.style.display = 'none';
      contentDel.style.display = 'block';
      contentTitle.innerHTML = 'Please Confirm';
      contentDel.innerHTML = "Delete '" + oldNode.text + "'?";
    }else{
      contentText.style.display = 'block';
      contentDel.style.display = 'none';
      contentTitle.innerHTML = 'Edit '+ oldNode.category +' name';
      contentText.value = oldNode.text;
    }
    btnOk.addEventListener('click', function(){
      editContent.style.display = 'none';
      contentText.style.display = 'none';
      contentDel.style.display = 'none';
      if( btnConfirm ){
        myDiagram.remove(oldNode);
      }else{
        myDiagram.model.setDataProperty(oldNode,'text',contentText.value);
      } 
    })
    btnCancel.addEventListener('click', function(){
      editContent.style.display = 'none';
      contentText.style.display = 'none';
      contentDel.style.display = 'none';
    })
  }
})()