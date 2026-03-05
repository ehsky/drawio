/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function () {
  // Adds UPN (Universal Process Notation) shapes
  Sidebar.prototype.addUPNPalette = function () {
    var sb = this;
    var dt = "upn universal process notation ";
    this.setCurrentSearchEntryLibrary("upn");

    // Shared child-row styles
    var resourceRowStyle =
      "shape=mxgraph.upn.resource;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=100;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;connectable=0;";
    var systemRowStyle =
      "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;whiteSpace=wrap;fontStyle=2;connectable=0;";

    // Helper to create an Activity Box cell hierarchy (standard swimlane + child rows)
    function createActivityBox(w, h) {
      var startSize = 78;
      var parentStyle =
        "shape=mxgraph.upn.activity;swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;" +
        "startSize=" +
        startSize +
        ";horizontalStack=0;" +
        "resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" +
        "rounded=1;arcSize=4;html=1;whiteSpace=wrap;" +
        "fillColor=#b0e3e6;strokeColor=#0e8088;swimlaneLine=1;swimlaneFillColor=none;" +
        "treeFolding=1;treeMoving=1;";

      var parent = new mxCell(
        "WHAT happens<br><i>(start with verb in base form)</i>",
        new mxGeometry(0, 0, w, h),
        parentStyle,
      );
      parent.vertex = true;

      // Resource row (with RASCI badges)
      var whoRow = new mxCell(
        "Resource Name",
        new mxGeometry(0, 0, w, 24),
        resourceRowStyle + "rasciR=1;rasciA=1;rasciS=1;rasciC=1;rasciI=1;",
      );
      whoRow.vertex = true;
      parent.insert(whoRow);

      // System name row (italic)
      var sysRow = new mxCell(
        "System Name",
        new mxGeometry(0, 0, w, 24),
        systemRowStyle,
      );
      sysRow.vertex = true;
      parent.insert(sysRow);

      return parent;
    }

    var fns = [];

    // WHAT Activity with connected Flow Line
    fns.push(
      sb.addEntry(dt + "what activity", function () {
        var w = 210;
        var h = 126;
        var activity = createActivityBox(w, h);

        var edge = new mxCell(
          "WHY does it happen?",
          new mxGeometry(0, 0, 0, 0),
          "shape=mxgraph.upn.flowLine;endArrow=blockThin;endFill=1;html=1;fontSize=11;isTerminated=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;",
        );
        edge.geometry.setTerminalPoint(new mxPoint(w + 160, h / 2), false);
        edge.geometry.relative = true;
        edge.edge = true;
        edge.setTerminal(activity, true);

        return sb.createVertexTemplateFromCells(
          [activity, edge],
          w + 160,
          h,
          "WHAT Activity",
        );
      }),
    );

    // Resource Row (standalone, can be added as child of Activity Box)
    fns.push(
      sb.createVertexTemplateEntry(
        "shape=mxgraph.upn.resource;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=100;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;rasciR=1;rasciA=1;rasciS=1;rasciC=1;rasciI=1;",
        210,
        24,
        "Resource Name",
        "Resource Row",
        null,
        dt + "resource row who rasci role badge",
      ),
    );

    // WHY Handoff
    fns.push(
      sb.createEdgeTemplateEntry(
        "shape=mxgraph.upn.flowLine;endArrow=blockThin;endFill=1;html=1;fontSize=11;isTerminated=0;",
        200,
        0,
        "WHY does it happen?",
        "WHY Handoff",
        null,
        dt + "why handoff flow line arrow",
      ),
    );

    this.addPalette(
      "upn",
      "UPN (Universal Process Notation)",
      false,
      mxUtils.bind(this, function (content) {
        for (var i = 0; i < fns.length; i++) {
          content.appendChild(fns[i](content));
        }
      }),
    );

    this.setCurrentSearchEntryLibrary();
  };
})();
