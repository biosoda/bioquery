hljs.initHighlightingOnLoad();
var width = 840,
	height = 500;

var cola = cola.d3adaptor(d3)
	.size([width, height]);

var svg = d3.select("#colajs").append("svg")
	.attr("width", width)
	.attr("height", height);

d3.json("js/colajs/data.json", function (error, graph) {

	var biosodacolor = ['#26348b', '#bf5e22', '#f1c1a4', '#987651'];
	var color = d3.scaleOrdinal(biosodacolor).domain(graph.nodes);

	var groupMap = {};
	graph.nodes.forEach(function (v, i) {
		var g = v.group;
		if (typeof groupMap[g] == 'undefined') {
			groupMap[g] = [];
		}
		groupMap[g].push(i);

		v.width = v.height = 10;
	});

	var groups = [];
	for (var g in groupMap) {
		groups.push({ id: g, leaves: groupMap[g] });
	}
	cola
		.nodes(graph.nodes)
		.links(graph.links)
		.groups(groups)
		.jaccardLinkLengths(80, 40)
		.avoidOverlaps(true)
		.start(20, 0, 40);

	var link = svg.selectAll(".link")
		.data(graph.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function (d) { return Math.sqrt(d.value); });

	var group = svg.selectAll('.group')
		.data(groups)
		.enter().append('g')
		.attr('class', 'group')
		.attr("data-groupid", function (d) { return d.id; })
		// .call(cola.drag);

		var grouprect = group.append("rect")
			.attr('rx',2)
			.attr('ry',2)
			.style("fill", function (d) { return color(d.id); })

		var recttitle = group.append("title")
			.text(function(d) {
				return graph.groups[d.id]['name'];
			})

		var recttext = group.append("text")
			.text(function(d,i) {
				return graph.groups[d.id]['name'];
			})
			.attr('x', 20)
			// .call(cola.drag);

	// http://bl.ocks.org/MoritzStefaner/1377729
	var node = svg.selectAll(".node")
		.data(graph.nodes)
		.enter().append("g")
		.attr("class", "node")
		.style("fill", function (d) {
			var tmpcol = color(d.group);
			return tmpcol;
		})
		.call(cola.drag);

		var nodecircle = node.append("circle")
			.data(graph.nodes)
			.attr("r", function(d, i) {
				var tmpr = 10;
				if (d.name == graph.groups[d.group]['name']) tmpr = 30;
				return tmpr;
			})
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
			.style("fill", function (d) {
				var tmpcol = color(d.group);
				return tmpcol;
			})
			.attr("data-fill", function (d) {
				var tmpcol = color(d.group);
				return tmpcol;
			})
			.attr("data-hovertarget", function(d) {
				return createHovertarget(d.group, graph.groups[d.group]['name'] + '.' + d.name);
			})

			var nodetitle = node.append("title")
				.text(function (d) { return d.name; });

			var nodetext = node.append("text")
				.text(function(d,i) {
					return d.name;
				})
				.attr('class', function(d,i) {
					if (d.name == graph.groups[d.group]['name']) return 'groupname';
					return 'attributename';
				})
				.attr('data-hovertarget', function(d, i) {
					return createHovertarget(d.group, graph.groups[d.group]['name'] + '.' + d.name);
				})
				.attr('onclick', function(d,i) {
					if (d.name == graph.groups[d.group]['name']) return false;
					return 'pushDatatableJSON("' + d.name + '", ' + d.group + ')';
				})
				.call(cola.drag);

	cola.on('tick', function () {
		link.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });

		node
			.attr("cx", function (d) {
				var newx = d.x;
				var newxcorr = Math.max(d.width, Math.min(newx, width-d.width));
				return newxcorr;
			})
			.attr("cy", function (d) {
				var newy = d.y;
				var newycorr = Math.max(d.height, Math.min(newy, width-d.height));
				return newycorr;
			});

		nodecircle
			.attr("cx", function (d) {
				var newx = d.x;
				var newxcorr = Math.max(d.width, Math.min(newx, width-d.width));
				return newxcorr;
			})
			.attr("cy", function (d) {
				var newy = d.y;
				var newycorr = Math.max(d.height, Math.min(newy, width-d.height));
				return newycorr;
			});

		nodetext
			.attr("x", function (d) {
				var newx = d.x;
				var newxcorr = Math.max(d.width, Math.min(newx, width-d.width));
				return newxcorr;
			})
			.attr("y", function (d) {
				var newy = d.y;
				var newycorr = Math.max(d.height, Math.min(newy, width-d.height));
				return newycorr;
			});

		recttext.attr("x", function(d) { return d.bounds.x; })
			.attr("y", function(d) { return d.bounds.y; });

		// not thinking outside of the box
		// https://bl.ocks.org/puzzler10/2531c035e8d514f125c4d15433f79d74
		grouprect
			.attr('x', function (d) {
				var newx = d.bounds.x - 20;
				var newxcorr = Math.max(0, Math.min(newx, width-d.bounds.width()));
				return newxcorr;
			})
			.attr('y', function (d) {
				var newy = d.bounds.y - 20;
				var newycorr = Math.max(0, Math.min(newy, height-d.bounds.height()));
				return newycorr;
			})
			.attr('width', function (d) {
				var neww = d.bounds.width() + 40;
				return neww;
			})
			.attr('height', function(d) {
				var newy = d.bounds.height() + 40;
				return newy;
			});
	});
});