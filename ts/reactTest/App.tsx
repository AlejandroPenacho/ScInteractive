import * as React from "react";

interface BlockData{
	state : number[],
	isSelected : boolean,
	connectedBlocks : number[]
}
interface AppParameters {
	actionScale : number,
	timestep : number
}
interface AppState {
	currentStatus : AppStatus,
	blockDataArray : BlockData[],
	connectionsArray : number[][]
}
enum AppStatus{
	Nothing,
	PuttingBlocks,
	RunningSimulation
}


class App extends React.Component{
	
	// Main app component, holds all the React components in it

	nBlocks : number;
	blockDataArray : BlockData[];
	simulationRunning : boolean;
	connectionsArray : number[][];
	parameters : AppParameters;
	state : AppState;
	props : any;
	blockHasBeenSelected : boolean;
	currentBlockSelected : number;

	constructor(props){
		
		
		
		super(props);


		
		// Counter of the number of blocks currently in the page
		this.nBlocks = 0;

		// blockData is an array of elements, each one representing the
		// key information of each block added to the page

		let blockDataArray = new Array(this.nBlocks);
		this.blockDataArray = blockDataArray;


		// simulationRunning is a boolean that becomes true when the
		// "Run simulation" button is clicked.

		this.simulationRunning = false;


		// If the initial number of blocks is over 1, these are initialized
		// with random positions. The structure of each element of the
		// blockData array consists on:
		//
		//		1. X position of the block
		//		2. Y position of the block
		//		3. An indication of whether the block is currently selected
		//		4. A list of all blocks that are connected to this one


		for (let i=0; i<this.nBlocks; i++){
			this.blockDataArray[i] = {
				state : [-150 + 300 * Math.random(), -150 + 300 * Math.random()],
				isSelected : false,
				connectedBlocks : new Array()
			}

		}

		// Connections array is initialized. Each element of this array consists
		// on an array of two values, indicating the index of the blocks it
		// connects.

		let nConnections = 0;
		let connectionsArray : number[][] = new Array(nConnections);
		this.connectionsArray = connectionsArray;

		// The state of the App component is initialized. The important variables
		// to track for re-rendering are the blocks, the connections and the status
		// of the App.

		// The status (currentStatus) can have three values:
		//		0 -> No blocks are being placed
		//		1 -> Clicking will place a box
		//		2 -> The simulation is running (TODO: this state should not exist)

		this.state = { 
			currentStatus : AppStatus.Nothing,
			blockDataArray : blockDataArray,
			connectionsArray : connectionsArray,
		};

		// Parameters of the App: actionScale relates the distance between
		// elements to the velocity they induce. Timestep sets the time for
		// updating the positions of the blocks (currently at 60 Hz).

		this.parameters = {actionScale : 0.1, timestep : 1/60};


		// These two variables are related to selection of blocks. 
		// blockHasBeenSelected indicates whether there is currently a block
		// selected. currentBlockSelected indicates the ID of this block.

		this.blockHasBeenSelected = false;
		this.currentBlockSelected = 0;
	}

	tickUpdate = () => {

		// For every frame, positions of the blocks are recalculated

		for (let i=0; i<this.nBlocks; i++) {

			// For each block, positions are obtained

			let x = this.blockDataArray[i].state[0];
			let y = this.blockDataArray[i].state[1];

			let vx = 0; 
			let vy = 0;

			// For every block to which the current is one connected, the
			// velocity increases in the direction of this block

			this.blockDataArray[i].connectedBlocks.map((secondBlock : number) => {
				vx += this.parameters.actionScale * (this.blockDataArray[secondBlock].state[0] - this.blockDataArray[i].state[0]);
				vy += this.parameters.actionScale * (this.blockDataArray[secondBlock].state[1] - this.blockDataArray[i].state[1]);
			})

			
			// New positions are obtained by integrating velocity

			let new_x = x + vx * this.parameters.timestep;
			let new_y = y + vy * this.parameters.timestep;


			this.blockDataArray[i].state[0] = new_x;
			this.blockDataArray[i].state[1] = new_y;
		}

		// State is updated
			
		this.setState({blockDataArray : this.blockDataArray })

	}

	changeCurrentStatus = (nextStatus : AppStatus) => {

		// Changes the status of the App. The first time "Run simulation" is
		// clicked, a clock that updates the state every timestep 
		this.setState({currentStatus : nextStatus});
		console.log(nextStatus);
		if (nextStatus === AppStatus.RunningSimulation && !this.simulationRunning) {
			this.simulationRunning = true;
			setInterval(this.tickUpdate, 1/60); //TODO: this should be this.prm.timestep
		}
	}


	clickOnBlock = (blockID : number) => {
		console.log("Click on " + blockID);
		if (this.blockHasBeenSelected){
			this.blockHasBeenSelected = false;
			this.connectionsArray.push([this.currentBlockSelected, blockID]);
			this.blockDataArray[this.currentBlockSelected].isSelected = false;
			this.blockDataArray[this.currentBlockSelected].connectedBlocks.push(blockID);
			this.blockDataArray[blockID].connectedBlocks.push(this.currentBlockSelected);
		} else {
			this.currentBlockSelected = blockID;
			this.blockHasBeenSelected = true;
			this.blockDataArray[blockID].isSelected = true;
		}
		this.connectionsArray.map((x) => console.log(x[0] + " to " + x[1]));
		this.setState({connections: this.connectionsArray, blockData : this.blockDataArray});
	}

	clickOnAir = (event : React.MouseEvent<HTMLElement>) => {
		if (this.state.currentStatus === 1) {
			

			if (event.clientX < (window.innerWidth) * 0.8) {
				let X = event.clientX - window.innerWidth/2;
				let Y = event.clientY - window.innerHeight/2;
				this.blockDataArray.push({state: [X, Y], isSelected : false, connectedBlocks : new Array()});
				this.nBlocks ++;
				this.setState({blockData : this.blockDataArray});
				console.log(this.blockDataArray);
			}
		}
	}


	render() {

	// let customStyle = {transform : "rotate(" + this.state.angle + "deg)"};
	return (
		<div className="App">
			<header className="App-header" onClick={this.clickOnAir}>
				<UserInterface currentStatus={this.state.currentStatus} changeCurrentStatusFunction={this.changeCurrentStatus}/>
				{this.connectionsArray.map((x) => {
					return <ConnectBar x0={this.state.blockDataArray[x[0]].state[0]} y0={this.state.blockDataArray[x[0]].state[1]} x1={this.state.blockDataArray[x[1]].state[0]} y1={this.state.blockDataArray[x[1]].state[1]} /> })
				}
				{[...Array(this.nBlocks).keys()].map((x) => {return <Block data={this.state.blockDataArray[x]} name={x} clickFunction={() => this.clickOnBlock(x)}/>})}
			</header>
		</div>
	  );
	}
}

class UserInterface extends React.Component{

	props : any;

	constructor(props){
		super(props)
	}


	render() {

		if (this.props.currentStatus === AppStatus.Nothing || this.props.currentStatus == AppStatus.RunningSimulation) {
			var addBlockMessage = "Add block";
			var addBlockFunction = () => this.props.changeCurrentStatusFunction(AppStatus.PuttingBlocks);
		} else {
			var addBlockMessage = "Stop adding blocks";
			var addBlockFunction = () => this.props.changeCurrentStatusFunction(AppStatus.Nothing);
		}
		
		return (
			<div className="userInterface">
				Small example of the consensus problem. Click "Add block" and click on the empty region to put bots. Click one bot to select it, and another to link them together.
				When you click "Run simulation", linked bots will get closer. All bots are expected to converge to the same location.
				<div className="userButton" onClick={addBlockFunction} >
					{addBlockMessage}
				</div>
				<div className="userButton" onClick={() => this.props.changeCurrentStatusFunction(AppStatus.RunningSimulation)} >
					Run simulation
				</div>
			</div>
		)
	}
}

class Block extends React.Component{

	props : {
		data : BlockData,
		name : number,
		clickFunction : React.MouseEventHandler<HTMLDivElement>
	};

	constructor(props){
		super(props)
	}

	
	render() {
		
		let positionData = {
			transform: "translate(" +  this.props.data.state[0] + "px, " + this.props.data.state[1] + "px)",
			outlineStyle : "none"
		}

		if (this.props.data.isSelected === true){
			positionData.outlineStyle = "solid";
		}

		return (
			<div className="myBlock" style={positionData} onClick={this.props.clickFunction}>
				{this.props.name}
			</div>
		)
	}
}

class ConnectBar extends React.Component {

	props : any;
	
	constructor(props){
		super(props)
	}

	render() {

		let x_position = (this.props.x0 + this.props.x1)/2;
		let y_position = (this.props.y0 + this.props.y1)/2;
		let angle = -Math.atan2((this.props.x1-this.props.x0),(this.props.y1-this.props.y0)) * 180 / Math.PI;
		let length = Math.pow(Math.pow(this.props.y1-this.props.y0, 2) + Math.pow(this.props.x1-this.props.x0, 2) , 0.5);
		let customStyle = {
			transform: "translate( " + x_position + "px, " + y_position + "px) rotate(" + angle + "deg)",
			height: length + "px"
		}

		return <div className="connectionBar" style={customStyle}></div>
	}
}

export default App;
