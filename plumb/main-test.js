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
    { category:"Start", from: 1, to: 2},
    { category:"", from: 2, to: 3, text: "yes" },
    { category:"", from: 2, to: 4, text: "no" },
    { category:"", from: 3, to: 5, text: "dosomething" },
    { category:"", from: 4, to: 6, text: "yes" },
    { category:"", from: 6, to: 5, text: "yes" },
    { category:"", from: 6, to: 7, text: "no"}
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
        $(go.Shape,
          { 
            geometryString:"M22.443 12.15l-11.286 11.3-2.606-2.606 11.292-11.294 2.6 2.6zM23.15 11.443l-2.599-2.599 1.727-1.728c0.391-0.391 1.024-0.388 1.417 0.003l1.18 1.177c0.392 0.391 0.395 1.025 0.005 1.416l-1.729 1.731zM7.904 21.611l2.495 2.495-3.135 0.617 0.64-3.113zM7 21l-1 5 5-1 14.58-14.58c0.784-0.784 0.786-2.054 0.010-2.83l-1.18-1.179c-0.779-0.779-2.037-0.783-2.83 0.010l-14.58 14.58z",
            alignment:go.Spot.Center,
            stroke:"#000",
            desiredSize: new go.Size(14, 14),
          }
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

	//按category分别建立连线
  myDiagram.linkTemplateMap.add("Start",
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 5 },
      $(go.Shape, { strokeWidth: 2, stroke: "#ca221f" }),
      $(go.Shape,  {
        toArrow:'OpenTriangle',
        fill:null, 
        stroke: "#ca221f",
        strokeWidth:2 }
      )
    )
  );
  myDiagram.linkTemplateMap.add("",
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 5 },
      new go.Binding("text").makeTwoWay(),
      $(go.Shape, { strokeWidth: 2, stroke: "#ca221f" }),
      $(go.Shape,  {
        toArrow:'OpenTriangle',
        fill:null, 
        stroke: "#ca221f",
        strokeWidth:2 }
      ),
      $(go.Panel, "Auto",
        {
          click:function(e,obj){editPanel(obj.part,'link');}
        },
        $(go.Shape, { fill: "#fff",strokeWidth:0 }),
        $(go.TextBlock, "?", {
            margin: 5 
          },
          new go.Binding("text").makeTwoWay()
        ),
        new go.Binding("segmentIndex").makeTwoWay(),
        new go.Binding("segmentFraction").makeTwoWay()
      )
    )
  );
	
  //设置model
	myDiagram.model = new go.GraphLinksModel(nodeDataArray,linkDataArray)


  //移动按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground", 
        _viewPosition: new go.Point(20,20),
        selectionAdorned: false, 
        selectionChanged:changePart
      },
      part("M17.984 5.921v8.063h8v-4l6.016 6.016-6.016 6.015v-4.093h-8v8.063h4.031l-6.015 6.015-6.016-6.015h4v-8.063h-8v4.062l-5.984-5.984 5.984-5.984v3.968h8v-8.063h-3.906l5.922-5.921 5.922 5.921h-3.938z",4)  
    )
  );

  //编辑按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground", 
        _viewPosition: new go.Point(50,20),
        selectionAdorned: false, 
        selectionChanged:changePart
      },
      part("M17.5 4c1.381 0 2.5 1.119 2.5 2.5 0 0.563-0.186 1.082-0.5 1.5l-1 1-3.5-3.5 1-1c0.418-0.314 0.937-0.5 1.5-0.5zM5 15.5l-1 4.5 4.5-1 9.25-9.25-3.5-3.5-9.25 9.25zM15.181 9.681l-7 7-0.862-0.862 7-7 0.862 0.862z",0)
    )
  );

  //复位按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground", 
        _viewPosition: new go.Point(80,20),
        selectionAdorned: false, 
        selectionChanged:changePart,
        click: load
      },
      part("M32 18.451l-16-12.42-16 12.42v-5.064l16-12.42 16 12.42zM28 18v12h-8v-8h-8v8h-8v-12l12-9z",4)   
    )
  );


  // myDiagram.add(
  //   $(go.Part,
  //     {
  //       layerName: "Foreground", 
  //       _viewPosition: new go.Point(0,0),
  //       height:600,
  //       selectionAdorned: false, 
  //       // selectionChanged:changeBar
  //     },
  //     $(go.Shape, { 
  //       width: 15, 
  //       margin: 2, 
  //       fill: "#f3f3f3", 
  //       stroke: null,
  //       stretch: go.GraphObject.Fill 
  //     })
  //   )
  // );



  //保持左上角图标位置不变
  myDiagram.addDiagramListener("ViewportBoundsChanged", function(e) {
    var dia = e.diagram;
    // only iterates through simple Parts in the diagram, not Nodes or Links
    dia.parts.each(function(part) {
      // and only on those that have the "_viewPosition" property set to a Point
      if (part._viewPosition) {
        part.position = dia.transformViewToDoc(part._viewPosition);
        part.scale = 1/dia.scale;
      }
    });
  });


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
      new go.Binding("location", "loc", go.Point.parse),
      new go.Binding("text").makeTwoWay(),
      {
        name: "PANEL" ,
        locationSpot: go.Spot.Center,
        cursor:"pointer",
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

  //左上角图标
  function part(str,num){
    return [
      $(go.Shape,'Rectangle',
        { 
          name: 'iconBg',
          desiredSize: new go.Size(24, 24),
          fill:"#fff",
          stroke:"#4a86a2",
          cursor: "pointer",
        }
      ),
      $(go.Shape,
        { 
          name: 'shape',
          geometryString:str,
          alignment:go.Spot.Center, 
          stroke:"#4a86a2",
          margin:num,
          cursor: "pointer",
          desiredSize: new go.Size(16, 16),
        }
      )
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

  //编辑node及link的方法
  function editPanel(node, str){
    var editContent = document.getElementById("edit-content");
    var contentTitle = document.getElementById("content-title");
    var contentText = document.getElementById("content-text");
    var contentDel = document.getElementById("content-del");
    var btnCancel = document.getElementById("btn-cancel");
    var btnOk = document.getElementById("btn-ok");

    var oldNode = null;

    if(str == 'del'){
      btnConfirm = true
      oldNode = node.adornedPart
    }else if(str == 'update'){
      btnConfirm = false
      oldNode = node.adornedPart
    }else{
      btnConfirm = false
      oldNode = node
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
      contentText.value = oldNode.text;
      if(str == 'update'){
        contentTitle.innerHTML = 'Edit '+ oldNode.category +' name';
      }else{
        contentTitle.innerHTML = 'Enter Text';
      }
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

  //左上角图标选择改变颜色
  function changePart(node){
    var iconBg = node.findObject("iconBg");
    var shape = node.findObject("shape");
    
    if (iconBg !== null) {
      if(node.isSelected)
        iconBg.fill = "#4a86a2";
      else
        iconBg.fill = "#fff";
    }
    if (shape !== null) {
      if(node.isSelected)
        shape.stroke = "#fff";
      else
        shape.stroke = "#4a86a2";
    }
  }

  //复位方法
  function load() {
    myDiagram.model = go.Model.fromJson({nodeDataArray,linkDataArray});
  }


})()