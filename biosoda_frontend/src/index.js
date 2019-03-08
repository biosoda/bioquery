// https://frontend-collective.github.io/react-sortable-tree/?selectedKind=Basics&selectedStory=Minimal%20implementation&full=0&addons=0&stories=1&panelRight=0
import React, { Component } from "react";
import { render } from "react-dom";
import { toggleExpandedForAll } from "react-sortable-tree"; // SortableTree, 
import 'react-sortable-tree/style.css';
import { find, addNodeUnderParent } from "react-sortable-tree";
// import FileExplorerTheme from 'react-sortable-tree-theme-minimal';
// import Select from 'react-select';
import { Async } from 'react-select'; // https://react-select.com/async
import fetch from 'isomorphic-fetch';
// import { getTreeFromFlatData } from './utils/tree-data-utils.js'; // https://github.com/frontend-collective/react-sortable-tree/blob/master/src/utils/tree-data-utils.js
import './appstyles.css';
import biosodadata from './biosodadata.json'; // https://stackoverflow.com/questions/29452822/how-to-fetch-data-from-local-json-file-on-react-native/37781882#37781882
import { Row, Col } from  'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'codemirror/lib/codemirror.css';
import TreeSearch from './treeSearchReact.js';
var Codemirror = require('react-codemirror');
require('codemirror/mode/sparql/sparql');
// var reactSortableTreeThemeBms = require("react-sortable-tree-theme-bms")
const varmasker = "$$"; // our vars are marked like $$genes$$

const defaultSparqlMessage = "Enter SPARQL query here or select one of the templates on the left"
const reactStringReplace = require('react-string-replace');
// const query = "?query=";

var lodestarResultsPerPage = 20;

class Fullhtml extends Component {
	render() {
		return this.props.code;
	}
}

class SparqlInputField extends Component {
	render() {
		var options = {
			lineNumbers: true,
			mode: 'sparql'
		};

		var currentSPARQLmessage = defaultSparqlMessage;
		if (this.props.superState.query !== '') {
			currentSPARQLmessage = this.props.superState.query;
		}

		return (
			<div>
				<h4 style={{ display: 'inline-block', marginRight:"20px"}}> SPARQL Query Editor </h4>
				<div>
				<Codemirror
					ref="cm"
					value={currentSPARQLmessage}
					onChange={this.props.updateCode}
					options={options}
				/>
				</div>
				<button onClick={this.props.handleSubmit} className="btn btn-success"> &gt; run this query </button>
			</div>
		);
	}
}


class App extends Component {

  _handleKeyPress (e) {
      if (e.key === 'Enter') {
        this.handleSubmit();
      }
  }

  /*
  fetch(url, {
  credentials: 'include', //pass cookies, for authentication
  method: 'post',
  headers: {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  body: form
});
  */
  
  node_logger(goal, name, query, timetaken) {
	var logbody = JSON.stringify({
		goal: goal,
		name: name,
		query: query,
		timetaken: timetaken
	});
	// console.log(logbody);
	fetch('http://biosoda.expasy.org:3002/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: logbody
	});
}

  
	updateCode(code = '') {
		if (typeof(this.refs.sparqy) !== "undefined") {
			var newCode = this.refs.sparqy.refs.cm.getCodeMirror().doc.getValue();
			this.setState({
				query: newCode,
				mode: 'sparql'
			});
		}
		return true; // is needed to break the asynchronity
	};

	handleShow(nodeid) {
		this.setState({ showSparql: true, lastActiveId: nodeid });
		// here we should re-render the whole menu tree
		this['updateQuery_' + nodeid]();
	}

	handleRun(nodeid) { // only called when user wants to run the question directly
		this.setState({ lastActiveId: nodeid });
		if (this['updateQuery_' + nodeid]()) {
			if(this.updateCode()) {
				this.setState({ asyncWaiter: 1 }, // workaround the asynchronity of setState
				() => {
					this.handleSubmit();
				});
			}
		}
	}

	handleSubmit() {
		var query = this.state.query;
		var queryUrl = this.state.queryTarget.replace(varmasker + 'query' + varmasker, encodeURIComponent(biosodadata.prefixes) + '\n' +  encodeURIComponent(query))
			.replace(varmasker + 'limit' + varmasker, this.state.lookupLimit)
			.replace(varmasker + 'offset' + varmasker, this.state.lookupOffset);
		var queryHeaders = this.state.queryHeaders;
		// empty results from last fetch?
		// show spinner to the user
		this.displayResults('');
		window.renderSparqlResultJsonAsTable(null, "results");
		this.node_logger('SPARQL', query, 'before', 0);
		var microstart = Date.now();
		return fetch(queryUrl, {headers: queryHeaders})
		.then(res => res.json())
		.then(
			(result) => {
				this.node_logger('SPARQL', query, 'after.resultcount: ' + result.results.bindings.length, 0);
				var microend = Date.now();
				var microtaken = microend - microstart;
				this.displayResults(result, microtaken);
			},
			(error) => {
				alert("Error! "+ error);
			}
		)
	}

  expand(expanded) {
	// console.log('ex called');
	var toggleData = toggleExpandedForAll({
            treeData: this.state.treeData,
            expanded,
        });
    this.setState({
        treeData: toggleData,
    });
  }
  collapseAll() {
	this.setState({ expanded: false });
    this.expand(false);
  }

  expandAll() {
	this.setState({ expanded: true });
    this.expand(true);
  }

  constructor(props) {
	super(props);
	document.title = "bioSODA web frontend";

	this.handleSubmit = this.handleSubmit.bind(this);
	this._handleKeyPress = this._handleKeyPress.bind(this);

	this.updateCode = this.updateCode.bind(this);
	this.handleShow = this.handleShow.bind(this);
	this.handleRun = this.handleRun.bind(this);

	this.expandAll = this.expandAll.bind(this);
	this.collapseAll = this.collapseAll.bind(this);
	this.displayResults = this.displayResults.bind(this);

	this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		showSparql: false,
		showSpinner: false,
		sparqlEndpointURL: '',
		hasResults: false,
		value: '',
		dynamicvals: [],
		treeData: [],
		resultOffset: 0,
		resultLimit: 25,
		lookupLimit: 10, // limits the results on var sparql lookups
		lookupOffset: 0, // probably never changes but who knows ;-)
		query: '', // SPARQL query to display in the SPARQL query editor
		queryHuman: 'none of our prepared queries', // human understandable query aka question
		estimatedRuntime: 'not known - hold on', // where applicable
		queryTarget: '', // where to send the SPARQL query
		queryHeaders: {},
		asyncWaiter : '',
		expanded: false,
	};

	// functionalities taken from lodestar/lode.js
	this['renderedTableFromJSON'] = (json) => {
		// console.log(json);
		var eltable = document.createElement('table');
		var headrow = json.head.vars;
		var _results = json.results.bindings;
		var _variables = json.head.vars;
		var elthead = document.createElement('thead');
		for (let onevar of _variables) {
			var elth = document.createElement('th');
			elth.appendChild(document.createTextNode(onevar));
			elthead.appendChild(elth);
		}
		eltable.appendChild(elthead);
		for (let row of _results) {
			var elrow = document.createElement('tr');
			for (let onevar of _variables) {
				var eltd = document.createElement('td');
				// row[onevar].type holds the type of the element uri, int, bool, ...
				if (row[onevar].type === 'uri') {
					var link = document.createElement('a');
					var text = document.createTextNode(row[onevar].value);
					link.appendChild(text);
					link.title = 'linked resource';
					link.href = row[onevar].value;
					link.target = '_blank';
					eltd.appendChild(link);
				} else {
					eltd.appendChild(document.createTextNode(row[onevar].value));
				}
				
				elrow.appendChild(eltd);
			}
			eltable.append(elrow);
		}
		return(eltable);
	}

	// https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-object
	// https://github.com/frontend-collective/react-sortable-tree/issues/49
	// two kind of nodes: structure and questions
	biosodadata.structure.forEach(function(element) {
		let NEW_NODE  = {
			id: element.id,
			title: element.title,
		};
		let newTree = addNodeUnderParent({
			treeData: this.state.treeData,
			newNode: NEW_NODE,
			expandParent: true,
			parentKey: element.parentId, // here we want to find the correct key using getParent from link above or similar/better
			getNodeKey: ({ node }) =>  node.id
		});
		this.state.treeData = newTree.treeData;
	}, this);

	biosodadata.questions.forEach(function(el) {
		el.parentIds.forEach(function(element) {
			var functionalQuestion = []; // we need that to have all questions as arrays even if they have no vars
			functionalQuestion.push(el.question);
			this['updateQuery_'+el.id] = (event) => {
				var newsparql = el.SPARQL;
				var humanReadable = el.question;
				var estimatedRuntime = el.estimatedseconds;
				if (typeof(el.vars) !== "undefined") {
					for (let onevar of el.vars) {
						var tmptype = onevar.type;
						if (tmptype === 'string' || tmptype === 'list') {
							var originalval = varmasker + onevar.name + varmasker;
							var replaceval;
							if (typeof(this.state.dynamicvals[el.id]) === 'undefined' || typeof(this.state.dynamicvals[el.id][onevar.name]) === 'undefined') {
								if (typeof(onevar.defaultvalue) !== "undefined") onevar.default = onevar.defaultvalue;
								replaceval = onevar.default;
							} else {
								replaceval = this.state.dynamicvals[el.id][onevar.name];
							}
							// console.log(onevar.name +'('+originalval+'): '+replaceval);
							newsparql = newsparql.split(originalval).join(replaceval.split("'").join("\\'")); // better than .replace because it replaces all of the occurences
							humanReadable = humanReadable.split(originalval).join(replaceval); // better than .replace because it replaces all of the occurences
						}
					}
				}
				this.setState({ query: newsparql, queryTarget: el.fetchUrl, queryHeaders: el.queryHeaders, queryHuman: humanReadable, estimatedRuntime: estimatedRuntime });
				// console.log(humanReadable);
				if(typeof(this.refs.sparqy) !== 'undefined') {
					// console.log('sparqy found');
					this.refs.sparqy.refs.cm.getCodeMirror().doc.setValue(newsparql); // .split("'").join("\\'")
				}
				return true; // is needed to break the asynchronity - is it?
			};
			if (typeof(el.vars) !== "undefined") {
				for (let onevar of el.vars) {
					if (onevar.type ==='string') {
						functionalQuestion = reactStringReplace(functionalQuestion, varmasker + onevar.name + varmasker, (match, i) => (<input key={onevar.name} name={onevar.name} id={el.id + "_" + onevar.name} defaultValue={onevar.default} onChange={(evt) => this.handleChange(evt.value, el.id, onevar.name, evt)} />));
					}
					if (onevar.type === 'list') {
						if (onevar.flavour === 'simpleelist') {
							// functionalQuestion = functionalQuestion.replace(varmasker + onevar.name + varmasker, 'dragon');
						}
						if (onevar.flavour === 'autocomplete') {
						this['fetchAutocomplete_'+onevar.name] = function(searchKey) {
							if (typeof(onevar.fullList) !== "undefined" && onevar.fullList === true) {
								searchKey = '';
							}
							return this.fetchAutocompleteBiosoda(onevar.datasource, searchKey, el.id, onevar.name);
						};
						functionalQuestion = reactStringReplace(functionalQuestion, varmasker + onevar.name + varmasker, (match, i) => (<Async key={onevar.name} name={onevar.name} id={el.id + "_" + onevar.name} classNamePrefix="my-select" className="autocomplete" defaultValue={{label: onevar.default}} noOptionsMessage={({ inputValue }) => !inputValue && 'Type keyword above to perform search. Found options will be listed here ...'} onChange={(evt) => this.handleChange(evt.value, el.id, onevar.name, evt)} cacheOptions loadOptions={this['fetchAutocomplete_'+onevar.name].bind(this)}  />));
						}
					}
				}
			}

			functionalQuestion.push(<button key={'showSPARQL_' + el.id} className="btn btn-primary buttonInfo" title="show query in SPARQL query editor" onClick={() => this.handleShow(el.id)}>i</button>);
			functionalQuestion.push(<button key={'submitquery_' + el.id} className="btn btn-success buttonSubmit" title="directly run this query" onClick={() => this.handleRun(el.id)}>&gt;</button>);

			if (typeof(el.fullHTML) !== "undefined") {
				// console.log('fully');
				functionalQuestion = [];
				functionalQuestion.push(<div dangerouslySetInnerHTML={{__html: el.question}} code={el.question} />);
			}

			let NEW_NODE  = {
				id: el.id,
				title: functionalQuestion,
			};

			let newTree = addNodeUnderParent({
				treeData: this.state.treeData,
				newNode: NEW_NODE,
				expandParent: true,
				parentKey: element, // here we want to find the correct key using getParent from link above or similar/better
				getNodeKey: ({ node }) =>  node.id
			});
			this.state.treeData = newTree.treeData;
		}, this);
	}, this);
}

	fetchAutocompleteBiosoda(datasource, searchString, questionid, varname){
		this.node_logger('async_'+questionid+"_"+varname, datasource, searchString, 0);
		var query = biosodadata.datasources[datasource].fetchQuery.split(varmasker + 'searchString' + varmasker).join(searchString.toLowerCase())
		var queryURL = biosodadata.datasources[datasource].fetchUrl.replace(varmasker + 'query' + varmasker, encodeURIComponent(query))
			.replace(varmasker + 'limit' + varmasker, this.state.lookupLimit)
			.replace(varmasker + 'offset' + varmasker, this.state.lookupOffset);
		var queryHeaders = biosodadata.datasources[datasource].queryHeaders;
		return fetch(queryURL, {headers: queryHeaders})
			.then((res) => res.json())
			.then((json) => {
				// we want to sort the results like this: exact match, startswith, endswith, contains
				// console.log(json.results);
				json.results.bindings.sort( (a,b) => {
					// same strings
					if (a.value.value === b.value.value) return 0;

					// if everything else is sorted, we go after the alphabet
					if (
						(
							a.value.value.toLowerCase().substring(a.length- searchString.length) === searchString.toLowerCase()
							&&
							b.value.value.toLowerCase().substring(b.length- searchString.length) === searchString.toLowerCase()
						)
						||
						(
							a.value.value.toLowerCase().substring(0, searchString.length) === searchString.toLowerCase()
							&&
							b.value.value.toLowerCase().substring(0, searchString.length) === searchString.toLowerCase()
						)
					) {
						if (a.value.value.toLowerCase() > b.value.value.toLowerCase()) return 1;
						if (a.value.value.toLowerCase() < b.value.value.toLowerCase()) return- 1;
					}

					// full match a
					if (a.value.value.toLowerCase() === searchString.toLowerCase()) return -1;
					// full match b
					if (b.value.value.toLowerCase() === searchString.toLowerCase()) return 1;

					// left position a
					if (a.value.value.toLowerCase().substring(0, searchString.length) === searchString.toLowerCase()) return -1;
					// left position b
					if (b.value.value.toLowerCase().substring(0, searchString.length) === searchString.toLowerCase()) return 1;

					// right position a
					if (a.value.value.toLowerCase().substring(a.length- searchString.length) === searchString.toLowerCase()) return -1;
					// right position b
					if (b.value.value.toLowerCase().substring(b.length- searchString.length) === searchString.toLowerCase()) return 1;


					return 0;
				});

				const formatted = json.results.bindings.map((l) => {
					if (typeof(l.name) === 'undefined') l.name = l.value;
					return Object.assign({}, {
						value: l.value.value,
						label: l.name.value
					});
				})
				this.setState({ options:formatted });
					return formatted;
				}).catch((error) => {
					console.error(error)
				})
	}

	handleChange (value, elid, varname, evt) {
		if (typeof(evt.target) !== "undefined") {
			value = evt.target.value;
		}
		var dynvals = this.state.dynamicvals;
		if (typeof(dynvals[elid]) == 'undefined') dynvals[elid] = [];
		dynvals[elid][varname] = value;
		this.setState({dynamicvals: dynvals});
		this['updateQuery_'+elid](); // to show the new query in the SPARQL field
	}

	displayResults (result, microtaken) {
		if (result !== '') {
			this.setState({ hasResults: true, showSpinner: false })
			console.log(result);
			document.getElementById('results').appendChild(document.createTextNode('Time taken: ' + microtaken/1000 + ' s, result count: ' + result.results.bindings.length));
			// links should link where they belong to or explain + link
			if (result.results.bindings.length > 0) {
				document.getElementById('results').appendChild(this.renderedTableFromJSON(result));
			}
			// works but we don't have a lode to explain over several thirdparty endpoints
			// window.renderSparqlResultJsonAsTable(result, "results"); // this is a lodestar function
		} else {
			this.setState({ showSpinner: true });
		}
	}

  render() {
	  
	  const { searchString, searchFocusIndex, searchFoundCount } = this.state;
	  
	const customSearchMethod = ({ node, searchQuery }) => {
		var found = searchQuery && JSON.stringify(node.title).toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      return found;
	}

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

	  /*
	  
			  <button
				type="button"
				disabled={!searchFoundCount}
				onClick={selectPrevMatch}
			  >
				&lt;
			  </button>

			  <button
				type="submit"
				disabled={!searchFoundCount}
				onClick={selectNextMatch}
			  >
				&gt;
			  </button>

			  <span>
				&nbsp;
				{searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
				&nbsp;/&nbsp;
				{searchFoundCount || 0}
			  </span>

	  */
	  
    return (
	  
      <div style={{ height: 700 }}>
  <h3><strong>Bio</strong>-Query<span style={{ fontSize: "0.6em", position: 'relative', bottom: '0.6em', color: 'red', fontFamily: 'monospace' }} title="BETA-Version - Working prototype with limited functionality">β</span>: Federated template <strong>s</strong>earch <strong>o</strong>ver biological <strong>da</strong>tabases </h3>
	  
	  <div style = {{marginTop:"20px", marginBottom:"10px"}}>
            


            
      </div>

	  

		<Row>
			<Col sm={this.state.showSparql? "7": "12"}>
			<form
			  style={{ display: 'inline-block' }}
			  onSubmit={event => {
				event.preventDefault();
			  }}
			>
			  <input
				id="find-box"
				type="text"
				placeholder="Search..."
				value={searchString}
				onChange={(event) => {
					this.setState({ searchString: event.target.value });
					this.node_logger('topsearch', event.target.value, '', 0);
				}}
			  />
			{ !this.state.expanded ?
				<button className="btn btn-primary btnmenu" onClick={this.expandAll}>
					Expand All
				</button>
				:
				<button className="btn btn-warning btnmenu" onClick={this.collapseAll}>
					Collapse All
				</button>
			}

            {
              this.state.showSparql ?
              <button
                className="btn btnmenu"
                style={{ backgroundColor: "#00FFFF"}}
                onClick={() => this.setState({ showSparql: false })}
              >
              Hide SPARQL Query Editor
            </button>
               :
               <button
                 className="btn btnmenu"
                 style={{backgroundColor: "#00FFFF"}}
                 onClick={() => this.setState({ showSparql: true })}
               >
               Show SPARQL Query Editor
             </button>
            }

			<button className="btn btn-success btnmenu" onClick={() => window.location.reload()}>
				Reset / Reload
			</button>

			</form>
				<div style={{ height: '700px', overflow: 'hidden', padding: '1em', overflowY: 'auto'}}>
				<TreeSearch
					treedata={this.state.treeData}
					searchString={this.state.searchString}
					fullExpansion={this.state.expanded}
					lastActiveId={this.state.lastActiveId}
				/>
				
								</div>
			</Col>
			 { this.state.showSparql ?
				<Col sm="5">
					<SparqlInputField
						ref="sparqy"
						displayResults={this.displayResults}
						handleSubmit={this.handleSubmit}
						superState={this.state}
						updateCode={this.updateCode}
					/>
				</Col>
				: null }
		</Row>
		{ this.state.showSpinner ?
			<Row id="spinnerwheel">
				<Col>
					<div className="progress">
						<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"> </div>
					</div>
				</Col>
			</Row>
		: null }
        <Row id="resultscol">
			<Col>
				<div id="technical" style={{display: 'none'}}>
					<div>Number of results (LIMIT): <span className="badge btn-primary">1</span> <span className="badge btn-primary">10</span> <span className="badge btn-primary">25</span></div>
					<div>Next page (OFFSET - if available): <span className="badge btn-primary">PREV</span> <span className="badge btn-primary">NEXT</span></div>
				</div>
				<div id="askedQuery" style={{padding: '1em'}}><span>Your Question: </span><span id="question">{this.state.queryHuman}</span></div>
				<div id="estimatedRuntume" style={{padding: '1em'}}><span>Estimated Runtime: </span><span id="estimatedRuntime">{this.state.estimatedRuntime}</span></div>
				<div id="results" ref="results"></div>
			</Col>
	   </Row>
      </div>
    );
  }
}

render(<App
	developersdata = {biosodadata}
/>, document.getElementById("root"));