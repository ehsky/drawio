/**
 * Copyright (c) 2006-2025, JGraph Holdings Ltd
 */
//**********************************************************************************************************************************************************
// UPN Activity Box
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeUPNActivity(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxShapeUPNActivity, mxRectangleShape);

mxShapeUPNActivity.prototype.customProperties = [
	{name: 'upnVariant', dispName: 'Variant', type: 'enum',
		enumList: [{val: 'default', dispName: 'Default'},
				   {val: 'exception', dispName: 'Exception'},
				   {val: 'automated', dispName: 'Automated'},
				   {val: 'manual', dispName: 'Manual'}]}
];

mxShapeUPNActivity.prototype.cst = {ACTIVITY : 'mxgraph.upn.activity'};

/**
 * Function: paintForeground
 *
 * Paints the foreground indicators (drill-down triangle).
 */
mxShapeUPNActivity.prototype.paintForeground = function(c, x, y, w, h)
{
	mxRectangleShape.prototype.paintForeground.apply(this, arguments);

	c.translate(x, y);

	// Auto-detect page link for drill-down indicator
	var hasPageLink = false;

	if (this.state != null && this.state.view != null && this.state.view.graph != null)
	{
		var graph = this.state.view.graph;
		var cell = this.state.cell;

		if (cell != null)
		{
			var link = graph.getLinkForCell(cell);

			if (link != null && link.substring(0, 13) == 'data:page/id,')
			{
				hasPageLink = true;
			}
		}
	}

	// Draw drill-down triangle indicator in top-left
	if (hasPageLink)
	{
		var triSize = 10;
		var margin = 5;

		c.setStrokeColor('none');
		c.setFillColor(mxUtils.getValue(this.style, 'strokeColor', '#6c8ebf'));
		c.begin();
		c.moveTo(margin, margin);
		c.lineTo(margin + triSize, margin);
		c.lineTo(margin + triSize / 2, margin + triSize);
		c.close();
		c.fill();
	}
};

mxCellRenderer.registerShape(mxShapeUPNActivity.prototype.cst.ACTIVITY, mxShapeUPNActivity);

//**********************************************************************************************************************************************************
// UPN Resource Row (WHO section) with RASCI badge
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeUPNResource(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxRectangleShape.
 */
mxUtils.extend(mxShapeUPNResource, mxRectangleShape);

mxShapeUPNResource.prototype.cst = {RESOURCE : 'mxgraph.upn.resource'};

mxShapeUPNResource.prototype.customProperties = [
	{name: 'rasciRole', dispName: 'RASCI Role', defVal: 'none', type: 'enum',
		enumList: [{val: 'none', dispName: 'None'},
				   {val: 'R', dispName: 'Responsible'},
				   {val: 'A', dispName: 'Accountable'},
				   {val: 'S', dispName: 'Supportive'},
				   {val: 'C', dispName: 'Consulted'},
				   {val: 'I', dispName: 'Informed'}]}
];

// RASCI badge colors: [background, text]
mxShapeUPNResource.prototype.rasciColors = {
	'R': ['#f8cecc', '#000000'],
	'A': ['#ffe0b2', '#000000'],
	'S': ['#d5e8d4', '#000000'],
	'C': ['#fff9c4', '#000000'],
	'I': ['#b3e5fc', '#000000']
};

/**
 * Function: paintForeground
 *
 * Paints the RASCI role badge on the left side of the resource row.
 */
mxShapeUPNResource.prototype.paintForeground = function(c, x, y, w, h)
{
	mxRectangleShape.prototype.paintForeground.apply(this, arguments);

	var role = mxUtils.getValue(this.style, 'rasciRole', 'none');

	if (role !== 'none' && this.rasciColors[role] != null)
	{
		var colors = this.rasciColors[role];
		var badgeSize = 14;
		var badgeX = 6;
		var badgeY = (h - badgeSize) / 2;

		c.translate(x, y);

		// Draw badge background
		c.setStrokeColor('none');
		c.setFillColor(colors[0]);
		c.roundrect(badgeX, badgeY, badgeSize, badgeSize, 2, 2);
		c.fill();

		// Draw badge letter
		c.setFontColor(colors[1]);
		c.setFontSize(10);
		c.setFontStyle(mxConstants.FONT_BOLD);
		c.text(badgeX + badgeSize / 2, badgeY + badgeSize / 2,
			0, 0, role, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE,
			0, null, 0, 0, 0);

		c.translate(-x, -y);
	}
};

mxCellRenderer.registerShape(mxShapeUPNResource.prototype.cst.RESOURCE, mxShapeUPNResource);
