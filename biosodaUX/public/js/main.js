var d3table = d3.select('#example');

function fillData(remove = false) {
	if (typeof(d3tablehead) !== 'undefined') {
		d3tablehead.remove();
		d3tablebody.remove();
	}
	d3tablehead = d3table.append('thead').append('tr');
	d3tablebody = d3table.append('tbody');
	d3tablehead.selectAll('th')
		.data(tabledata).enter()
		.append('th')
			.text(function (d) {
				return d.column;
			})

	var d3tr = d3tablebody.selectAll('tr')
		.data(tabledata[0].values).enter()
		.append('tr')
			.attr('data-rownum', function (d, i) {
				return i;
			})

	var d3td = d3tr.selectAll('td')
		.data(tabledata).enter()
		.append('td')
			.attr('data-colnum', function (d, i) {
				return i;
			})
	
	d3tablebody.selectAll('td')
		.text(function (d, i, j) {
			var thisrow = this.parentNode.getAttribute('data-rownum');
			var thiscol = this.getAttribute('data-colnum');
			return tabledata[thiscol].values[thisrow];
		})

	d3tablehead.selectAll('th')
		.filter(function(d) {
			if (d.original) return false;
			return true;
		})
		.append('button')
		.attr('class', 'close')
		.html('&times;')
		.attr('onclick', 'pushDatatable(this.__data__)')

}

function pushDatatable(data) {
	var deleted = false;
	tabledata = $.grep(tabledata, function (single, i) {
		if (single == data) {
			deleted = true;
			return false;
		}
		return true;
	});
	if (deleted === false) {
		tabledata.push(data);
	}
	fillData();
}

function pushDatatableJSON(colname, groupid) {
	d3.json("js/colajs/data.json", function (error, graph) {
		graph.nodes.forEach(function (v, i) {
			if (v.name == colname && v.group == groupid) {
				pushDatatable({ 'column': graph.groups[groupid].name + '.' + colname, 'values': v.dataexample });
			}
		});
	});
}