// copied from http://jsfiddle.net/infiniteluke/908earbh/9/
// https://stackoverflow.com/questions/47289239/nested-list-using-react

/*
	<div id="treeSearch">
		<div id="search">
			<input>
		</div>
		<div id="tree">
			<ul>
				<li>titelone</li>
				<li>titeltwo
					<ul>
						<li></li>
						<li>
							<ul>
								[...]
							</ul>
						</<li>
					</ul>

				</li>
				<li></li>
				<li></li>
			</ul>
		</div>
	</div>
*/

import React, { Component } from "react";

export class TreeSearch  extends Component {
	constructor(props, context) {
		super(props)
		this.state = {
			treedatafiltered: this.props.treedata
		};
		// console.log(this.props.treedata);
	}

	render() {
		return (
			<div id="searchTree">
				<NestedTree
					treedata={this.state.treedatafiltered}
					searchString={this.props.searchString}
					fullExpansion={this.props.fullExpansion}
					lastActiveId={this.props.lastActiveId}
					useInnerLimits={this.props.useInnerLimits}
				/>
			</div>
		);
	}
}

export class NestedTree extends Component {
	constructor(props, context) {
		super(props)
	}
	render() {
		var wholetree = this.props.treedata.map((onelement) => {
			return <NestedNodes
				treedata = {onelement} key={onelement.id}
				searchString={this.props.searchString}
				fullExpansion={this.props.fullExpansion}
				lastActiveId={this.props.lastActiveId}
				useInnerLimits={this.props.useInnerLimits}
			/>
		});
		return (
			<div id="tree">
				<ul id="whole" className={this.props.searchString.length ? "searchmode" : ""}>
					{wholetree}
				</ul>
			</div>
		);
	}
}

export class NestedNodes extends Component {
	constructor(props, context) {
		super(props)
		// https://codepen.io/_danko/pen/yJqRWr
		this.handleClick = this.handleClick.bind(this)
		this.thisopen = false
	}
	handleClick() {
		this.thisopen = !this.thisopen
		this.setState({})
	}
	resetClick() {
		this.thisopen = false; // there should be a possibility to call this reset function on the click of the collapse button
	}
	renderChild = (child) => {
		// console.log(child);
		// this.key = child.id;
		// console.log(this.props.searchString + ' ' + child.title.indexOf(this.props.searchString) + ' ' + child.title);
		// JSON.stringify(node.title).toLowerCase().indexOf(searchQuery.toLowerCase())
		// var tmpfound = child.title.indexOf(this.props.searchString) > 0;
		var tmpfoundhere = JSON.stringify(child.title).toLowerCase().indexOf(this.props.searchString.toLowerCase())
		var tmpfoundlower = JSON.stringify(child).toLowerCase().indexOf(this.props.searchString.toLowerCase());
		var actualclassnames = [
			child.id,
			this.thisopen || this.props.fullExpansion || this.props.searchString.length ? "open" : "closed",
			this.props.searchString.length && tmpfoundhere > 0 ? "searchstringfound" : "",
			this.props.searchString.length && tmpfoundlower > 0 ? "searchstringfoundlower" : "",
			this.props.searchString.length && tmpfoundhere < 0 && tmpfoundlower < 0 ? "searchstringnotfound" : "",
			child.id === this.props.lastActiveId ? "lastActive" : "",
		].join(' ');
		// console.log(child.title + " --- " + typeof(child.children));
		// console.log(child.title + " --- " + actualclassnames);
		if (typeof(child.children) === 'undefined') {
			// this.state.searchString
			// console.log(child);
			// console.log(this.props);
			var btnestsec = '';
			if (typeof(child.estimatedSeconds) != 'undefined' && this.props.useInnerLimits === true) {
				btnestsec = <button className="btn btn-warning btn-sm" title="estimated runtime of original query" style={{ fontSize: "0.666em"}} disabled>{(child.estimatedSeconds*2).toString().toHHMMSS()}</button>
			} else if (typeof(child.estimatedSeconds) != 'undefined') {
				btnestsec = <button className="btn btn-secondary btn-sm" title="estimated runtime of original query with limited results" style={{ fontSize: "0.666em"}} disabled>{(child.estimatedSeconds*2).toString().toHHMMSS()}</button>
			} else {
				btnestsec = '';
			}
			return(
				<li key={child.id} data-haschild="false" className={actualclassnames}><div className="title">{child.title} {btnestsec}</div></li>
			);
		} else {
			return (
				<li key={child.id} data-haschild="true" className={actualclassnames}><div className="title" onClick={this.handleClick} ><div className="plusminus" ></div>{child.title}</div>
					<ul key={child.id}>
						{child.children.map(child => {
							return <NestedNodes
								treedata={child} key={child.id}
								searchString={this.props.searchString}
								fullExpansion={this.props.fullExpansion}
								lastActiveId={this.props.lastActiveId}
								useInnerLimits={this.props.useInnerLimits}
							/>
						})}
					</ul>
				</li>
			);
		}
	}

	render() {
		return [this.renderChild(this.props.treedata)]
	}
}

export default TreeSearch;
// include in index.js - React.render(<TreeSearch teams={teams} />, document.body);