import React, {Component} from 'react';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';

//from https://github.com/JedWatson/react-select/blob/revert-2781-tidy-up-rollup/examples/src/components/GithubUsers.js
//shown here: https://jedwatson.github.io/react-select/

export default class GithubUsers extends Component{
//const GithubUsers = createClass({
	/*displayName: 'GithubUsers',
	propTypes: {
		label: PropTypes.string,
	},*/
	constructor(props){
    super(props);
    this.state = {
      displayName: 'GithubUsers',
			backspaceRemoves: true,
			multi: true,
			creatable: false
		}
  }
	getInitialState () {
		return {
			backspaceRemoves: true,
			multi: true,
			creatable: false,
		};
	}
	onChange (value) {
		this.setState({
			value: value,
		});
	}
	switchToMulti () {
		this.setState({
			multi: true,
			value: [this.state.value],
		});
	}
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value ? this.state.value[0] : null
		});
	}
	getUsers (input) {
		if (!input) {
			return Promise.resolve({ options: [] });
		}

		return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
	}
	gotoUser (value, event) {
		window.open(value.html_url);
	}
	toggleBackspaceRemoves () {
		this.setState({
			backspaceRemoves: !this.state.backspaceRemoves
		});
	}
	toggleCreatable () {
		this.setState({
			creatable: !this.state.creatable
		});
	}
	render () {
		const AsyncComponent = Select.Async;
		/*this.state.creatable
			? Select.AsyncCreatable
			: Select.Async;*/

		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label} <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/GithubUsers.js">(Source)</a></h3>
				<AsyncComponent multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getUsers} backspaceRemoves={this.state.backspaceRemoves} />
				<div className="checkbox-list">
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={this.state.multi} onChange={this.switchToMulti}/>
						<span className="checkbox-label">Multiselect</span>
					</label>
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={!this.state.multi} onChange={this.switchToSingle}/>
						<span className="checkbox-label">Single Value</span>
					</label>
				</div>
				<div className="checkbox-list">
					<label className="checkbox">
					   <input type="checkbox" className="checkbox-control" checked={this.state.creatable} onChange={this.toggleCreatable} />
					   <span className="checkbox-label">Creatable?</span>
					</label>
					<label className="checkbox">
					   <input type="checkbox" className="checkbox-control" checked={this.state.backspaceRemoves} onChange={this.toggleBackspaceRemoves} />
					   <span className="checkbox-label">Backspace Removes?</span>
					</label>
				</div>
				<div className="hint">This example uses fetch.js for showing Async options with Promises</div>
			</div>
		);
	}
//});

}

//module.exports = GithubUsers;
