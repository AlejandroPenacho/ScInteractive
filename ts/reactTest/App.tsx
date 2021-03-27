class App extends React.Component{
	
	// Main app component, holds all the React components in it

	constructor(props){
		super(props);
		
		// Counter of the number of blocks currently in the page
		this.nBlocks = 0;

		// blockData is an array of elements, each one representing the
		// key information of each block added to the page

		let blockData = new Array(this.nBlocks);
		this.blockData = blockData;


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
			this.blockData[i] = new Array(4);
			this.blockData[i][0] = -150 + 300 * Math.random();
			this.blockData[i][1] = -150 + 300 * Math.random();
			this.blockData[i][2] = 0;
			this.blockData[i][3] = new Array(0);
		}

		// Connections array is initialized. Each element of this array consists
		// on an array of two values, indicating the index of the blocks it
		// connects.

		let nConnections = 0;
		let connections = new Array(nConnections);
		this.connections = connections;

		// The state of the App component is initialized. The important variables
		// to track for re-rendering are the blocks, the connections and the status
		// of the App.

		// The status (currentStatus) can have three values:
		//		0 -> No blocks are being placed
		//		1 -> Clicking will place a box
		//		2 -> The simulation is running (TODO: this state should not exist)

		this.state = { 
			currentStatus : 0,
			blockData: blockData,
			connections : connections,
		};

		// Parameters of the App: actionScale relates the distance between
		// elements to the velocity they induce. Timestep sets the time for
		// updating the positions of the blocks (currently at 60 Hz).

		this.prmt = {actionScale : 0.1, timestep : 1/60};


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

			let x = this.blockData[i][0];
			let y = this.blockData[i][1];

			let vx = 0; 
			let vy = 0;

			// For every block to which the current is one connected, the
			// velocity increases in the direction of this block

			this.blockData[i][3].map((secondBlock) => {
				vx += this.prmt.actionScale * (this.blockData[secondBlock][0] - this.blockData[i][0]);
				vy += this.prmt.actionScale * (this.blockData[secondBlock][1] - this.blockData[i][1]);
			})

			
			// New positions are obtained by integrating velocity

			let new_x = x + vx * this.prmt.timestep;
			let new_y = y + vy * this.prmt.timestep;


			this.blockData[i][0] = new_x;
			this.blockData[i][1] = new_y;
		}

		// State is updated
			
		this.setState({blockData : this.blockData })

	}

	changeCurrentStatus = (nextStatus) => {

		// Changes the status of the App. The first time "Run simulation" is
		// clicked, a clock that updates the state every timestep 
		this.setState({currentStatus : nextStatus});
		console.log(nextStatus);
		if (nextStatus === 2 && !this.simulationRunning) {
			this.simulationRunning = true;
			setInterval(this.tickUpdate, 1/60); //TODO: this should be this.prm.timestep
		}
	}


	clickOnBlock = (blockID) => {
		console.log("Click on " + blockID);
		if (this.blockHasBeenSelected){
			this.blockHasBeenSelected = false;
			this.connections.push([this.currentBlockSelected, blockID]);
			this.blockData[this.currentBlockSelected][2] = 0;
			this.blockData[this.currentBlockSelected][3].push(blockID);
			this.blockData[blockID][3].push(this.currentBlockSelected);
		} else {
			this.currentBlockSelected = blockID;
			this.blockHasBeenSelected = true;
			this.blockData[blockID][2] = 1;
		}
		this.connections.map((x) => console.log(x[0] + " to " + x[1]));
		this.setState({connections: this.connections, blockData : this.blockData});
	}

	clickOnAir = (e) => {
		if (this.state.currentStatus === 1) {
			

			if (e.clientX < (window.innerWidth) * 0.8) {
				let X = e.clientX - window.innerWidth/2;
				let Y = e.clientY - window.innerHeight/2;
				this.blockData.push([X,Y,0,new Array(0)]);
				this.nBlocks ++;
				this.setState({blockData : this.blockData});
				console.log(this.blockData);
			}
		}
	}


	render() {

	let customStyle = {transform : "rotate(" + this.state.angle + "deg)"};
	return (
		<div className="App">
			<header className="App-header" onClick={this.clickOnAir}>
				<UserInterface currentStatus={this.state.currentStatus} changeCurrentStatusFunction={this.changeCurrentStatus}/>
				{this.connections.map((x) => {
					return <ConnectBar x0={this.state.blockData[x[0]][0]} y0={this.state.blockData[x[0]][1]} x1={this.state.blockData[x[1]][0]} y1={this.state.blockData[x[1]][1]} /> })
				}
				{[...Array(this.nBlocks).keys()].map((x) => {return <Block data={this.state.blockData[x]} name={x} clickFunction={() => this.clickOnBlock(x)}/>})}
			</header>
		</div>
	  );
	}
}

class UserInterface extends React.Component{

	constructor(props){
		super(props)
	}


	render() {

		if (this.props.currentStatus === 0 || this.props.currentStatus == 2) {
			var addBlockMessage = "Add block";
			var addBlockFunction = () => this.props.changeCurrentStatusFunction(1);
		} else {
			var addBlockMessage = "Stop adding blocks";
			var addBlockFunction = () => this.props.changeCurrentStatusFunction(0);
		}
		
		return (
			<div className="userInterface">
				<div className="userButton" onClick={addBlockFunction} >
					{addBlockMessage}
				</div>
				<div className="userButton" onClick={() => this.props.changeCurrentStatusFunction(2)} >
					Run simulation
				</div>
			</div>
		)
	}
}

class Block extends React.Component{

	constructor(props){
		super(props)
	}

	
	render() {
		
		let positionData = {
			transform: "translate(" +  this.props.data[0] + "px, " + this.props.data[1] + "px)",
			outlineStyle : "none"
		}

		if (this.props.data[2] === 1){
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
