/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	// Adds UPN (Universal Process Notation) shapes
	Sidebar.prototype.addUPNPalette = function()
	{
		var sb = this;
		var dt = 'upn universal process notation ';
		this.setCurrentSearchEntryLibrary('upn');

		// Shared styles
		var sectionHeaderStyle = 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontStyle=1;fontSize=11;whiteSpace=wrap;';
		var rowStyle = 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;';
		var dividerStyle = 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;';

		// Color variants: [fillColor, strokeColor, label suffix]
		var variants = [
			['#dae8fc', '#6c8ebf', 'Default', 'default'],
			['#f8cecc', '#b85450', 'Exception', 'exception'],
			['#d5e8d4', '#82b366', 'Automated', 'automated'],
			['#f5f5f5', '#666666', 'Manual', 'manual']
		];

		// Helper to create an Activity Box cell hierarchy for a given variant
		function createActivityBox(fillColor, strokeColor, variantVal, w, h)
		{
			var startSize = 26;
			var parentStyle = 'shape=mxgraph.upn.activity;swimlane;fontStyle=0;align=center;verticalAlign=top;' +
				'childLayout=stackLayout;horizontal=1;startSize=' + startSize + ';horizontalStack=0;' +
				'resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;' +
				'rounded=1;arcSize=10;html=1;whiteSpace=wrap;' +
				'fillColor=' + fillColor + ';strokeColor=' + strokeColor + ';' +
				'upnVariant=' + variantVal + ';';

			var parent = new mxCell('', new mxGeometry(0, 0, w, h), parentStyle);
			parent.vertex = true;

			// What section - activity description
			var whatRow = new mxCell('WHAT happens (start with verb in base form)',
				new mxGeometry(0, 0, w, 34), rowStyle + 'fontSize=12;');
			whatRow.vertex = true;
			parent.insert(whatRow);

			// Divider between What and Who
			var div1 = new mxCell('', new mxGeometry(0, 0, w, 8), dividerStyle);
			div1.vertex = true;
			parent.insert(div1);

			// Who section header
			var whoHeader = new mxCell('WHO', new mxGeometry(0, 0, w, 20), sectionHeaderStyle + 'fontSize=10;fontColor=#888888;');
			whoHeader.vertex = true;
			parent.insert(whoHeader);

			// Who row - resource with RASCI badge
			var whoResourceStyle = 'shape=mxgraph.upn.resource;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=24;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;rasciRole=R;';
			var whoRow = new mxCell('Resource Name',
				new mxGeometry(0, 0, w, 22), whoResourceStyle);
			whoRow.vertex = true;
			parent.insert(whoRow);

			// Divider between Who and System
			var div2 = new mxCell('', new mxGeometry(0, 0, w, 8), dividerStyle);
			div2.vertex = true;
			parent.insert(div2);

			// System section header
			var sysHeader = new mxCell('SYSTEM', new mxGeometry(0, 0, w, 20), sectionHeaderStyle + 'fontSize=10;fontColor=#888888;');
			sysHeader.vertex = true;
			parent.insert(sysHeader);

			// System row
			var sysRow = new mxCell('System Name',
				new mxGeometry(0, 0, w, 22), rowStyle);
			sysRow.vertex = true;
			parent.insert(sysRow);

			return parent;
		}

		var fns = [];

		// Activity Box variants
		for (var i = 0; i < variants.length; i++)
		{
			(function(variant)
			{
				fns.push(sb.addEntry(dt + 'activity box ' + variant[2].toLowerCase(), function()
				{
					var w = 220;
					var h = 186;
					var cell = createActivityBox(variant[0], variant[1], variant[3], w, h);

					return sb.createVertexTemplateFromCells([cell], w, h, 'Activity Box (' + variant[2] + ')');
				}));
			})(variants[i]);
		}

		// Flow Line
		fns.push(sb.createEdgeTemplateEntry('endArrow=blockThin;endFill=1;html=1;fontSize=11;',
			200, 0, 'WHY does it happen?', 'Flow Line', null,
			dt + 'flow line arrow why handoff'));

		this.addPalette('upn', 'UPN (Universal Process Notation)', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));

		this.setCurrentSearchEntryLibrary();
	};

})();
