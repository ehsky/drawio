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
      "shape=mxgraph.upn.resource;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=100;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;";
    var systemRowStyle =
      "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;fontStyle=2;";

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
        "WHAT happens<br>(start with verb in base form)",
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

    // Initialize UPN drill-down navigation
    this.initUPNDrillDown();
  };

  /**
   * Initializes UPN drill-down navigation:
   * - Forces shape redraw when page links change on UPN activity cells
   * - Adds double-click-to-navigate for drill-down into sub-processes
   * - Provides breadcrumb trail and back button for navigation
   */
  Sidebar.prototype.initUPNDrillDown = function () {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var model = graph.getModel();

    // === Navigation Stack ===
    // Tracks pages visited via UPN drill-down for back navigation
    var navStack = [];

    // === Helper: Check if a cell uses the UPN Activity shape ===
    function isUPNActivity(cell) {
      if (cell == null) return false;

      try {
        var style = graph.getCellStyle(cell);
        return (
          style != null &&
          style[mxConstants.STYLE_SHAPE] === "mxgraph.upn.activity"
        );
      } catch (e) {
        return false;
      }
    }

    // === Helper: Walk up the parent chain to find a UPN Activity ===
    function findUPNActivityParent(cell) {
      var current = cell;
      var depth = 0;

      while (current != null && depth < 10) {
        if (isUPNActivity(current)) return current;

        current = model.getParent(current);
        depth++;
      }

      return null;
    }

    // === Helper: Get page link ID from a cell or its children ===
    function getPageLinkId(cell) {
      if (cell == null) return null;

      // Check the cell itself
      var link = graph.getLinkForCell(cell);

      if (link != null && link.substring(0, 13) === "data:page/id,") {
        return link.substring(13);
      }

      // Check child cells (link may be set on a child row)
      var childCount = model.getChildCount(cell);

      for (var i = 0; i < childCount; i++) {
        var child = model.getChildAt(cell, i);
        var childLink = graph.getLinkForCell(child);

        if (
          childLink != null &&
          childLink.substring(0, 13) === "data:page/id,"
        ) {
          return childLink.substring(13);
        }
      }

      return null;
    }

    // =========================================================================
    // 1. DOUBLE-CLICK DRILL-DOWN: Navigate to linked sub-process page
    // =========================================================================
    graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
      if (evt.isConsumed()) return;

      var cell = evt.getProperty("cell");

      if (cell == null) return;

      // Find the UPN activity parent of whatever was double-clicked
      var upnCell = findUPNActivityParent(cell);

      if (upnCell == null) return;

      var pageId = getPageLinkId(upnCell);

      if (pageId == null) return;

      // Find the target page
      var page = ui.getPageById(pageId);

      if (page == null) return;

      // Push current page onto navigation stack
      navStack.push({
        page: ui.currentPage,
        pageId: ui.currentPage.getId(),
        pageName: ui.currentPage.getName() || "Untitled",
      });

      // Navigate to the child process page
      ui.selectPage(page);

      // Update the breadcrumb trail
      updateBreadcrumb();

      // Prevent default double-click behavior (text editing)
      evt.consume();
    });

    // =========================================================================
    // 2. BREADCRUMB TRAIL: Visual navigation bar for process hierarchy
    // =========================================================================
    var breadcrumbContainer = null;

    function ensureBreadcrumbContainer() {
      if (breadcrumbContainer != null) return;

      breadcrumbContainer = document.createElement("div");
      breadcrumbContainer.className = "upn-drill-breadcrumb";
      breadcrumbContainer.style.cssText =
        "position:absolute;top:8px;left:50%;transform:translateX(-50%);" +
        "z-index:100;background:rgba(30,40,60,0.92);color:#fff;" +
        "padding:5px 14px;border-radius:6px;font-size:13px;" +
        "display:none;align-items:center;gap:4px;" +
        "box-shadow:0 2px 8px rgba(0,0,0,0.25);font-family:Arial,Helvetica,sans-serif;" +
        "pointer-events:auto;user-select:none;white-space:nowrap;" +
        "max-width:80%;overflow-x:auto;";

      // Insert into the editor container, above the graph
      var container = graph.container;

      if (container != null && container.parentNode != null) {
        container.parentNode.style.position =
          container.parentNode.style.position || "relative";
        container.parentNode.appendChild(breadcrumbContainer);
      }
    }

    function updateBreadcrumb() {
      ensureBreadcrumbContainer();

      if (navStack.length === 0) {
        breadcrumbContainer.style.display = "none";
        return;
      }

      breadcrumbContainer.style.display = "flex";
      breadcrumbContainer.innerHTML = "";

      // Back button
      var backBtn = document.createElement("span");
      backBtn.innerHTML = "&#x2190;"; // ← arrow
      backBtn.style.cssText =
        "cursor:pointer;font-size:16px;margin-right:6px;opacity:0.85;" +
        "padding:0 4px;border-radius:3px;";
      backBtn.title = "Back to parent process";

      backBtn.addEventListener("mouseover", function () {
        this.style.background = "rgba(255,255,255,0.15)";
      });

      backBtn.addEventListener("mouseout", function () {
        this.style.background = "none";
      });

      backBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        navigateBack();
      });

      breadcrumbContainer.appendChild(backBtn);

      // Breadcrumb items for each level in the stack
      for (var i = 0; i < navStack.length; i++) {
        (function (index) {
          var entry = navStack[index];

          var link = document.createElement("span");
          link.textContent = entry.pageName;
          link.style.cssText =
            "cursor:pointer;opacity:0.75;padding:1px 4px;border-radius:3px;";
          link.title = "Navigate to: " + entry.pageName;

          link.addEventListener("mouseover", function () {
            this.style.opacity = "1";
            this.style.background = "rgba(255,255,255,0.12)";
          });

          link.addEventListener("mouseout", function () {
            this.style.opacity = "0.75";
            this.style.background = "none";
          });

          link.addEventListener("click", function (e) {
            e.stopPropagation();
            navigateToLevel(index);
          });

          breadcrumbContainer.appendChild(link);

          // Separator
          var sep = document.createElement("span");
          sep.textContent = " \u203A "; // › character
          sep.style.cssText = "opacity:0.4;font-size:14px;";
          breadcrumbContainer.appendChild(sep);
        })(i);
      }

      // Current page name (not clickable)
      var currentLabel = document.createElement("span");
      currentLabel.textContent = ui.currentPage.getName() || "Current Process";
      currentLabel.style.cssText = "font-weight:bold;opacity:1;";
      breadcrumbContainer.appendChild(currentLabel);
    }

    function navigateBack() {
      if (navStack.length > 0) {
        var entry = navStack.pop();

        // Find the page (it may have been renamed/moved)
        var page = ui.getPageById(entry.pageId) || entry.page;

        if (page != null) {
          ui.selectPage(page);
        }

        updateBreadcrumb();
      }
    }

    function navigateToLevel(index) {
      if (index >= 0 && index < navStack.length) {
        var entry = navStack[index];

        // Remove everything from this index onwards
        navStack.splice(index);

        var page = ui.getPageById(entry.pageId) || entry.page;

        if (page != null) {
          ui.selectPage(page);
        }

        updateBreadcrumb();
      }
    }

    // =========================================================================
    // 3. CLEAR NAV STACK on manual page changes (tab clicks)
    // =========================================================================
    ui.editor.addListener("pageSelected", function () {
      if (navStack.length > 0) {
        updateBreadcrumb();
      }
    });

    // =========================================================================
    // 4. KEYBOARD SHORTCUT: Escape to go back up
    // =========================================================================
    mxEvent.addListener(document, "keydown", function (e) {
      // Alt+Up arrow or Backspace (when not editing) to go back
      if (
        navStack.length > 0 &&
        !graph.isEditing() &&
        ((e.altKey && e.keyCode === 38) ||
          (e.keyCode === 8 && document.activeElement === document.body))
      ) {
        navigateBack();
        e.preventDefault();
        e.stopPropagation();
      }
    });
  };
})();
