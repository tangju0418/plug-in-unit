(function(){
  //nodeDataArray：图表中node数组

  //key: 连线使用的标识
  //category ：用来区分不同类型的node
  //loc: node的位置
  //size: node文字面板的尺寸
  //bgSize： node可增加连线面板的尺寸
  //text: node中显示文字
  //shape: node显示形状
  //color: node文字面板的颜色
  var nodeDataArray = [
    { key: 1, category:"Start",    "loc":"0 240",   "size":"80 50",   "bgSize":"100 70",  text: "start",       shape: "Ellipse",   color: "#4f6f7e" },
    { key: 2, category:"Question", "loc":"150 200", "size":"120 120", "bgSize":"140 140", text: "question1",   shape: "Diamond",   color: "#4f6f7e" },
    { key: 3, category:"Action",   "loc":"330 280", "size":"80 80",   "bgSize":"100 100", text: "action1",     shape: "Rectangle", color: "#4f6f7e" },
    { key: 4, category:"Question", "loc":"350 100", "size":"120 120", "bgSize":"140 140", text: "question2",   shape: "Diamond",   color: "#4f6f7e" },
    { key: 5, category:"End",      "loc":"430 450", "size":"100 60",  "bgSize":"100 60",  text: "dosomething", shape: "auto",      color: "#4f6f7e" },
    { key: 6, category:"Action",   "loc":"700 250", "size":"80 80",   "bgSize":"100 100", text: "action2",     shape: "Rectangle", color: "#4f6f7e" },
    { key: 7, category:"End",      "loc":"650 400", "size":"100 60",  "bgSize":"100 60",  text: "dosomething", shape: "auto",      color: "#4f6f7e" }
  ];

  //linkDataArray：图表中link数组

  //category ：用来区分不同类型的link
  //from: key值相同的node为连线起点
  //to: key值相同的node为连线终点
  //text： link中的文字描述
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

  //create a Diagram
  var myDiagram =
    $(go.Diagram, "myDiagramDiv", 
    {
      initialContentAlignment: go.Spot.Center,  //初始化图表的位置
      allowDrop: true,  //接收调色板拖入的node
      "undoManager.isEnabled": true, //可以用键盘快捷键复制、粘贴、删除node
      "toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom, //鼠标滚轮缩放图表
    });

  //选中node显示button
  var nodeSelectionAdornmentTemplate = 
    $(go.Adornment, "Spot",  // this Adornment has two Button of the selected node
      $(go.Panel, "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder)
      ),
      //编辑node按钮
      $("Button",
        {
          cursor: "pointer",
          alignment: go.Spot.TopLeft,
          alignmentFocus: go.Spot.TopLeft,
          click:function(e,obj){editNode(obj.part.adornedPart);}  // define click behavior for this Button in the Adornment
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
      //删除node按钮
      $("Button",
        {
          cursor: "pointer",
          alignment: go.Spot.TopRight,
          alignmentFocus: go.Spot.TopRight,
          click: function(e,obj){deleteNode(obj.part.adornedPart);}  // define click behavior for this Button in the Adornment
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
      {
        locationSpot: go.Spot.Center,
        mouseEnter: function (e, obj) { obj.part.ports.each(function(port) {
          port.fill = "#bbb"}); },
        mouseLeave: function (e, obj) { obj.part.ports.each(function(port) {
          port.fill = "#e1e1e1"}); },
      },
      new go.Binding("location", "loc", go.Point.parse),
      nodeBg('Ellipse'),
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("Question",  // the default category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate }, //被选中展示有编辑、删除按钮的面板
      nodeBg('Diamond'), 
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("End",  // the End category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate }, //被选中展示有编辑、删除按钮的面板
      nodeBg('Rectangle'),
      nodeTemplate()
  ));

  myDiagram.nodeTemplateMap.add("Action",  // the Action category
    $(go.Node, "Spot", nodeStyle(),
      { selectionObjectName: "PANEL", selectionAdornmentTemplate: nodeSelectionAdornmentTemplate }, //被选中展示有编辑、删除按钮的面板
      nodeBg('Rectangle'),
      nodeTemplate()
  ));

  //按category分别建立连线
  myDiagram.linkTemplateMap.add("Start",  // the Start category
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 5 },
      $(go.Shape, { strokeWidth: 2, stroke: "#f76258" }),
      $(go.Shape,  {
        toArrow:'OpenTriangle',
        fill:null, 
        stroke: "#f76258",
        strokeWidth:2 }
      )
    )
  );
  myDiagram.linkTemplateMap.add("",  // the default category
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 5 },
      new go.Binding("text").makeTwoWay(),
      $(go.Shape, { strokeWidth: 2, stroke: "#f76258" }),
      $(go.Shape,  {
        toArrow:'OpenTriangle',
        fill:null, 
        stroke: "#f76258",
        strokeWidth:2 }
      ),
      // 连线中的文字面板
      $(go.Panel, "Auto",
        {
          click:function(e,obj){editLinkPanel(obj.part);}
        },
        $(go.Shape, { fill: "#fff",strokeWidth:0 }),
        $(go.TextBlock, "?", { //连线中的文字默认显示"?"
            margin: 5 
          },
          new go.Binding("text").makeTwoWay() //双向绑定显示linkDataArray中的"text"
        )
      )
    )
  );
  
  //设置model，将数组nodeDataArray与linkDataArray分配给图表中的node和link
  myDiagram.model = new go.GraphLinksModel(nodeDataArray,linkDataArray)


  //左上角移动按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground",  //将此节点设置为最上层
        _viewPosition: new go.Point(30,30),
        selectionAdorned: false, 
        selectionChanged:changePart //被选中执行方法changePart
      },
      part("M17.984 5.921v8.063h8v-4l6.016 6.016-6.016 6.015v-4.093h-8v8.063h4.031l-6.015 6.015-6.016-6.015h4v-8.063h-8v4.062l-5.984-5.984 5.984-5.984v3.968h8v-8.063h-3.906l5.922-5.921 5.922 5.921h-3.938z",4)  
    )
  );

  //左上角编辑按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground",  //将此节点设置为最上层
        _viewPosition: new go.Point(60,30),
        selectionAdorned: false, 
        selectionChanged:changePart //被选中执行方法changePart
      },
      part("M17.5 4c1.381 0 2.5 1.119 2.5 2.5 0 0.563-0.186 1.082-0.5 1.5l-1 1-3.5-3.5 1-1c0.418-0.314 0.937-0.5 1.5-0.5zM5 15.5l-1 4.5 4.5-1 9.25-9.25-3.5-3.5-9.25 9.25zM15.181 9.681l-7 7-0.862-0.862 7-7 0.862 0.862z",0)
    )
  );

  //左上角复位按钮
  myDiagram.add(
    $(go.Part,
      {
        layerName: "Foreground",  //将此节点设置为最上层
        _viewPosition: new go.Point(90,30),
        selectionAdorned: false, 
        selectionChanged:changePart, //被选中执行方法changePart
        click: load
      },
      part("M32 18.451l-16-12.42-16 12.42v-5.064l16-12.42 16 12.42zM28 18v12h-8v-8h-8v8h-8v-12l12-9z",4)   
    )
  );

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
          { category:"Action",   "size":"80 80",   "bgSize":"100 100", text: "Action",   shape: "Rectangle", color: "#4f6f7e" },
          { category:"Question", "size":"120 120", "bgSize":"140 140", text: "Question", shape: "Diamond",   color: "#4f6f7e" },
          { category:"End",      "size":"100 60",  "bgSize":"100 60",  text: "Output",   shape: "auto",      color: "#4f6f7e" }
        ])
      });


  //概述图
  var myOverview =
    $(go.Overview, "myOverviewDiv",
      { observed: myDiagram });  //观察图表myDiagram

  //node的属性及方法
  function nodeStyle() {
    return [
      new go.Binding("location", "loc", go.Point.parse),  //用nodeDataArray中的"loc"绑定位置
      new go.Binding("text").makeTwoWay(),  //双向绑定显示nodeDataArray中的"text"
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
          fromLinkable: true,  //fromLinkable：是否可以作为link起点
          toLinkable: true,  //toLinkable：是否可以作为link终点
          fill: "#e1e1e1",
          portId: 'nodeBg',
        },
        new go.Binding("desiredSize", "bgSize", go.Size.parse).makeTwoWay(go.Size.stringify),  //用nodeDataArray中的"bgSize"双向绑定尺寸
        new go.Binding("fromLinkable", "category", function(v) { return (v != 'Start' && v != 'End')}), //根据nodeDataArray中的"category"确定是否可以可以作为link起点
        new go.Binding("toLinkable", "category", function(v) { return v != 'Start'}),  //根据nodeDataArray中的"category"确定是否可以可以作为link终点
      )
    
  }

 
  //node展示内容的子面板
  function nodeTemplate(){
    return [
      $(go.Panel, "Auto",
        $(go.Shape, 
          { 
            cursor: "move",
            fill: "lightblue"
          },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),  //用nodeDataArray中的"size"双向绑定尺寸
          new go.Binding("cursor", "category",function(v){ return (v == 'Start' ? 'pointer' : 'move')}),  //根据nodeDataArray中的"category"确定鼠标图标
          new go.Binding("figure", "shape"),  //用nodeDataArray中的"shape"绑定形状
          new go.Binding("fill", "color")),  //用nodeDataArray中的"color"绑定颜色
        $(go.TextBlock,
         "Default Text", 
         { 
           text:"textAlign:'center'",
           margin: 6, 
           stroke: "#fff", 
           font: "14px sans-serif" 
          },
           new go.Binding("text").makeTwoWay()  //用nodeDataArray中的"text"双向绑定显示文字
        )
        
      ),

    ];
  }

  //左上角显示图标
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
      port.fill = (show ? "#bbb" : '#e1e1e1');
    });
  }

  //编辑node文字
  function editNode(node){
    var dialogText = 'Edit '+ node.category +' name';
    var editText = node.text;
    showDialog(dialogText, editText, true, function(value){
      myDiagram.model.setDataProperty(node,'text',value);
    },function(){
      console.log('cancel')
    })
  }

  //编辑link文字
  function editLinkPanel(node){
    var dialogText = 'Enter Text';
    var editText = node.text;
    showDialog(dialogText, editText, true, function(value){
      myDiagram.model.setDataProperty(node,'text',value);
    },function(){
      console.log('cancel')
    })
  }

  //删除node
  function deleteNode(node){
    var dialogText = 'Please Confirm';
    var editText = "Delete '" + node.text + "'?";
    showDialog(dialogText, editText, false, function(value){
      myDiagram.remove(node);
    },function(){
      console.log('cancel')
    })
  }

  //显示提示框
  function showDialog(dialogText, editText, isEditable, onOkFn, onCancelFn){
    var editContent = document.getElementById("edit-content");
    var contentTitle = document.getElementById("content-title");
    var contentText = document.getElementById("content-text");
    var contentDel = document.getElementById("content-del");
    var btnCancel = document.getElementById("btn-cancel");
    var btnOk = document.getElementById("btn-ok");

    editContent.style.display = 'block';
    contentTitle.innerHTML = dialogText;
    contentText.value = editText;
    contentDel.innerHTML = editText;

    if(isEditable){
      contentText.style.display = 'block';
      contentDel.style.display = 'none';
    }else{
      contentText.style.display = 'none';
      contentDel.style.display = 'block';
    }

    function confirm(){
      editContent.style.display = 'none';
      onOkFn(contentText.value)
      //取消"OK"和"Cancel"按钮监听click事件
      btnOk.removeEventListener('click', confirm);
      btnCancel.removeEventListener('click', cancel);
    }
    function cancel(){
      editContent.style.display = 'none';
      onCancelFn()
      //取消"OK"和"Cancel"按钮监听click事件
      btnOk.removeEventListener('click', confirm);
      btnCancel.removeEventListener('click', cancel);
    }

    //"OK"按钮监听click事件
    btnOk.addEventListener('click', confirm);
    //"Cancel"按钮监听click事件
    btnCancel.addEventListener('click', cancel);
    
  }


  //点击左上角按钮变化颜色
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