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
