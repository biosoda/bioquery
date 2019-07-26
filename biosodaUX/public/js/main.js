var d3table = d3.select('#example');

function fillData(remove = false) {
	if (typeof(d3tablehead) !== 'undefined') {
		d3tablehead.remove();
		d3tablehead2nd.remove();
		d3tablebody.remove();
	}
	d3tablehead = d3table.append('thead').append('tr');
	d3tablehead2nd = d3table.append('thead').append('tr');
	d3tablebody = d3table.append('tbody');
	
	d3tablehead.selectAll('th')
		.data(tabledata).enter()
		.append('th')
			.text(function (d) {
				return d.column;
			})

	d3tablehead2nd.selectAll('th')
		.data(tabledata).enter()
		.append('th')
			.html(function (d) {
				thisfilter = '*';
				if (typeof(filterrules[d.column]) != 'undefined') {
					thisfilter = filterrules[d.column];
				}
				return '<input class="filter" value="' + thisfilter.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '" onchange="saveFilter(\'' + d.column + '\', this.value)">';
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
		.classed('notoriginal', true)
		.append('div')
			.attr('class', 'fas fa-times leftright closetimes')
			.html('')
			.attr('onclick', 'pushDatatable(this.__data__)')

	d3tablehead.selectAll('th')
		.filter(function(d, i) {
			if (d.original) return false;
			return true;
		})
		.append('div')
			.attr('class', 'fas fa-arrow-left leftright left')
			.html('')
			.attr('onclick', 'moveDatatable(this.__data__, "left")')
	d3tablehead.selectAll('thead .notoriginal:first-of-type .leftright.left').remove();

	d3tablehead.selectAll('th')
		.filter(function(d) {
			if (d.original) return false;
			return true;
		})
		.append('div')
			.attr('class', 'fas fa-arrow-right leftright right')
			.html('')
			.attr('onclick', 'moveDatatable(this.__data__, "right")')
	d3tablehead.selectAll('th:last-child .leftright.right').remove();
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

function moveDatatable(data, direction) {
	var found = false;
	tabledata.forEach(function (single, i) {
		if (single == data && found === false) {
			if (direction === 'left') {
				tmpleft = tabledata[i-1];
				tmpthis = tabledata[i];
				tabledata[i] = tmpleft;
				tabledata[i-1] = tmpthis;
			} else {
				tmpright = tabledata[i+1];
				tmpthis = tabledata[i];
				tabledata[i] = tmpright;
				tabledata[i+1] = tmpthis;
			}
			found = true
			return false;
		}
	});
	fillData();
}
filterrules = [];
function saveFilter(columnname, filter) {
	filterrules[columnname] = filter;
}