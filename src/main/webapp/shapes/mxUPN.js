/**
 * Copyright (c) 2006-2025, JGraph Holdings Ltd
 */
//**********************************************************************************************************************************************************
// UPN Activity Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeUPNActivity(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth != null ? strokewidth : 1;
}

/**
 * Extends mxRectangleShape.
 */
mxUtils.extend(mxShapeUPNActivity, mxRectangleShape);

mxShapeUPNActivity.prototype.cst = { ACTIVITY: "mxgraph.upn.activity" };

/**
 * Function: paintForeground
 *
 * Paints the foreground indicators (drill-down triangle).
 * Checks the cell itself AND its children for page links,
 * so the indicator appears regardless of where the link is set.
 */
mxShapeUPNActivity.prototype.paintForeground = function (c, x, y, w, h) {
  mxRectangleShape.prototype.paintForeground.apply(this, arguments);

  c.translate(x, y);

  var strokeColor = mxUtils.getValue(this.style, "strokeColor", "#4a6fa5");

  // === Auto-detect page link for drill-down indicator ===
  var hasPageLink = false;

  if (
    this.state != null &&
    this.state.view != null &&
    this.state.view.graph != null
  ) {
    var graph = this.state.view.graph;
    var cell = this.state.cell;

    if (cell != null) {
      var link = graph.getLinkForCell(cell);

      if (link != null && link.substring(0, 13) == "data:page/id,") {
        hasPageLink = true;
      }

      if (!hasPageLink) {
        var childCount = graph.getModel().getChildCount(cell);

        for (var i = 0; i < childCount; i++) {
          var child = graph.getModel().getChildAt(cell, i);
          var childLink = graph.getLinkForCell(child);

          if (
            childLink != null &&
            childLink.substring(0, 13) == "data:page/id,"
          ) {
            hasPageLink = true;
            break;
          }
        }
      }
    }
  }

  this._upnHasPageLink = hasPageLink;

  // Draw drill-down indicator (offset right to avoid fold icon)
  if (hasPageLink) {
    var triSize = 14;
    var margin = 22;
    var marginY = 5;

    c.setStrokeColor("none");
    c.setFillColor(strokeColor);
    c.begin();
    c.moveTo(margin, marginY);
    c.lineTo(margin + triSize, marginY);
    c.lineTo(margin + triSize / 2, marginY + triSize * 0.85);
    c.close();
    c.fill();

    c.setFillColor("#ffffff");
    c.setGlobalAlpha(0.6);
    var inner = triSize * 0.35;
    var cx = margin + triSize / 2;
    var cy = marginY + triSize * 0.35;
    c.begin();
    c.moveTo(cx - inner / 2, cy);
    c.lineTo(cx + inner / 2, cy);
    c.lineTo(cx, cy + inner * 0.85);
    c.close();
    c.fill();
    c.setGlobalAlpha(1);
  }
};

mxCellRenderer.registerShape(
  mxShapeUPNActivity.prototype.cst.ACTIVITY,
  mxShapeUPNActivity,
);

//**********************************************************************************************************************************************************
// UPN Resource Row (WHO section) with RASCI badge
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeUPNResource(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth != null ? strokewidth : 1;
}

/**
 * Extends mxRectangleShape.
 */
mxUtils.extend(mxShapeUPNResource, mxRectangleShape);

mxShapeUPNResource.prototype.cst = { RESOURCE: "mxgraph.upn.resource" };

mxShapeUPNResource.prototype.customProperties = [
  { name: "rasciR", dispName: "Responsible (R)", defVal: false, type: "bool" },
  { name: "rasciA", dispName: "Accountable (A)", defVal: false, type: "bool" },
  { name: "rasciS", dispName: "Supportive (S)", defVal: false, type: "bool" },
  { name: "rasciC", dispName: "Consulted (C)", defVal: false, type: "bool" },
  { name: "rasciI", dispName: "Informed (I)", defVal: false, type: "bool" },
];

// RASCI badge colors: [background, text]
mxShapeUPNResource.prototype.rasciColors = {
  R: ["#e53e3e", "#ffffff"],
  A: ["#3182ce", "#ffffff"],
  S: ["#38a169", "#ffffff"],
  C: ["#d69e2e", "#ffffff"],
  I: ["#805ad5", "#ffffff"],
};

/**
 * Function: paintForeground
 *
 * Paints the RASCI role badge on the right side of the resource row.
 */
mxShapeUPNResource.prototype.paintForeground = function (c, x, y, w, h) {
  mxRectangleShape.prototype.paintForeground.apply(this, arguments);

  // Check which RASCI roles are selected
  var selectedRoles = [];
  if (
    mxUtils.getValue(this.style, "rasciR", false) == "1" ||
    mxUtils.getValue(this.style, "rasciR", false) === true
  )
    selectedRoles.push("R");
  if (
    mxUtils.getValue(this.style, "rasciA", false) == "1" ||
    mxUtils.getValue(this.style, "rasciA", false) === true
  )
    selectedRoles.push("A");
  if (
    mxUtils.getValue(this.style, "rasciS", false) == "1" ||
    mxUtils.getValue(this.style, "rasciS", false) === true
  )
    selectedRoles.push("S");
  if (
    mxUtils.getValue(this.style, "rasciC", false) == "1" ||
    mxUtils.getValue(this.style, "rasciC", false) === true
  )
    selectedRoles.push("C");
  if (
    mxUtils.getValue(this.style, "rasciI", false) == "1" ||
    mxUtils.getValue(this.style, "rasciI", false) === true
  )
    selectedRoles.push("I");

  if (selectedRoles.length > 0) {
    c.translate(x, y);

    var badgeSize = 16;
    var badgeSpacing = 2;
    var badgeY = (h - badgeSize) / 2;
    // Position badges on the right side of the cell
    var totalBadgeWidth =
      selectedRoles.length * badgeSize +
      (selectedRoles.length - 1) * badgeSpacing;
    var startX = w - totalBadgeWidth - 8; // Right aligned with 8px margin

    // Draw badges for each selected role
    for (var i = 0; i < selectedRoles.length; i++) {
      var role = selectedRoles[i];
      if (this.rasciColors[role] != null) {
        var colors = this.rasciColors[role];
        var badgeX = startX + i * (badgeSize + badgeSpacing);

        // Draw badge background circle (no border)
        c.setFillColor(colors[0]);
        c.ellipse(badgeX, badgeY, badgeSize, badgeSize);
        c.fill();

        // Draw badge letter
        c.setFontColor(colors[1]);
        c.setFontSize(10);
        c.setFontStyle(mxConstants.FONT_BOLD);
        c.text(
          badgeX + badgeSize / 2,
          badgeY + badgeSize / 2,
          0,
          0,
          role,
          mxConstants.ALIGN_CENTER,
          mxConstants.ALIGN_MIDDLE,
          0,
          null,
          0,
          0,
          0,
        );
      }
    }

    c.translate(-x, -y);
  }
};

mxCellRenderer.registerShape(
  mxShapeUPNResource.prototype.cst.RESOURCE,
  mxShapeUPNResource,
);

//**********************************************************************************************************************************************************
// UPN Flow Line with Terminator
//**********************************************************************************************************************************************************
/**
 * Extends mxConnector.
 */
function mxShapeUPNFlowLine() {
  mxConnector.call(this);
}

/**
 * Extends mxConnector.
 */
mxUtils.extend(mxShapeUPNFlowLine, mxConnector);

mxShapeUPNFlowLine.prototype.cst = { FLOW_LINE: "mxgraph.upn.flowLine" };

mxShapeUPNFlowLine.prototype.customProperties = [
  {
    name: "isTerminated",
    dispName: "Is Terminated",
    defVal: false,
    type: "bool",
  },
];

/**
 * Function: paintEdgeShape
 *
 * Paints the edge shape.
 */
mxShapeUPNFlowLine.prototype.paintEdgeShape = function (c, pts, rounded) {
  // Paint the standard connector
  mxConnector.prototype.paintEdgeShape.apply(this, arguments);

  var isTerminated = mxUtils.getValue(this.style, "isTerminated", false);

  if (isTerminated == "1" || isTerminated === true) {
    // Calculate position for terminated symbol (along the arrow direction)
    if (pts.length >= 2) {
      // Get the last two points to determine arrow direction
      var lastPt = pts[pts.length - 1];
      var secondLastPt = pts[pts.length - 2];

      // Calculate direction vector from second-to-last to last point
      var dx = lastPt.x - secondLastPt.x;
      var dy = lastPt.y - secondLastPt.y;

      // Normalize the direction vector
      var length = Math.sqrt(dx * dx + dy * dy);
      if (length > 0) {
        dx /= length;
        dy /= length;
      }

      // Position terminated symbol along the arrow direction (extending the line)
      var offsetDistance = 20; // Distance from arrow tip
      var x = lastPt.x + dx * offsetDistance;
      var y = lastPt.y + dy * offsetDistance;

      // Draw white circle background
      var symbolSize = 16;
      c.setFillColor("#ffffff");
      c.setStrokeColor("#d32f2f");
      c.setStrokeWidth(2);
      c.ellipse(x - symbolSize / 2, y - symbolSize / 2, symbolSize, symbolSize);
      c.fillAndStroke();

      // Draw ❌ symbol
      c.setStrokeColor("#d32f2f");
      c.setStrokeWidth(2);
      var crossSize = 6;
      c.begin();
      c.moveTo(x - crossSize / 2, y - crossSize / 2);
      c.lineTo(x + crossSize / 2, y + crossSize / 2);
      c.moveTo(x + crossSize / 2, y - crossSize / 2);
      c.lineTo(x - crossSize / 2, y + crossSize / 2);
      c.end();
      c.stroke();
    }
  }
};

mxCellRenderer.registerShape(
  mxShapeUPNFlowLine.prototype.cst.FLOW_LINE,
  mxShapeUPNFlowLine,
);
