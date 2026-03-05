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
  var keys = ["R", "A", "S", "C", "I"];
  var selectedRoles = [];

  for (var k = 0; k < keys.length; k++) {
    var val = mxUtils.getValue(this.style, "rasci" + keys[k], false);

    if (val == "1" || val === true) {
      selectedRoles.push(keys[k]);
    }
  }

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
// UPN Flow Line (WHY Handoff)
//**********************************************************************************************************************************************************
/**
 * Extends mxConnector.
 */
function mxShapeUPNFlowLine() {
  mxConnector.call(this);
}

mxUtils.extend(mxShapeUPNFlowLine, mxConnector);

mxShapeUPNFlowLine.prototype.cst = { FLOW_LINE: "mxgraph.upn.flowLine" };

mxCellRenderer.registerShape(
  mxShapeUPNFlowLine.prototype.cst.FLOW_LINE,
  mxShapeUPNFlowLine,
);
