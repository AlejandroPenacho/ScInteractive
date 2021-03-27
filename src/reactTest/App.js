var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    // Main app component, holds all the React components in it
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.tickUpdate = function () {
            // For every frame, positions of the blocks are recalculated
            var _loop_1 = function (i) {
                // For each block, positions are obtained
                var x = _this.blockData[i][0];
                var y = _this.blockData[i][1];
                var vx = 0;
                var vy = 0;
                // For every block to which the current is one connected, the
                // velocity increases in the direction of this block
                _this.blockData[i][3].map(function (secondBlock) {
                    vx += _this.prmt.actionScale * (_this.blockData[secondBlock][0] - _this.blockData[i][0]);
                    vy += _this.prmt.actionScale * (_this.blockData[secondBlock][1] - _this.blockData[i][1]);
                });
                // New positions are obtained by integrating velocity
                var new_x = x + vx * _this.prmt.timestep;
                var new_y = y + vy * _this.prmt.timestep;
                _this.blockData[i][0] = new_x;
                _this.blockData[i][1] = new_y;
            };
            for (var i = 0; i < _this.nBlocks; i++) {
                _loop_1(i);
            }
            // State is updated
            _this.setState({ blockData: _this.blockData });
        };
        _this.changeCurrentStatus = function (nextStatus) {
            // Changes the status of the App. The first time "Run simulation" is
            // clicked, a clock that updates the state every timestep 
            _this.setState({ currentStatus: nextStatus });
            console.log(nextStatus);
            if (nextStatus === 2 && !_this.simulationRunning) {
                _this.simulationRunning = true;
                setInterval(_this.tickUpdate, 1 / 60); //TODO: this should be this.prm.timestep
            }
        };
        _this.clickOnBlock = function (blockID) {
            console.log("Click on " + blockID);
            if (_this.blockHasBeenSelected) {
                _this.blockHasBeenSelected = false;
                _this.connections.push([_this.currentBlockSelected, blockID]);
                _this.blockData[_this.currentBlockSelected][2] = 0;
                _this.blockData[_this.currentBlockSelected][3].push(blockID);
                _this.blockData[blockID][3].push(_this.currentBlockSelected);
            }
            else {
                _this.currentBlockSelected = blockID;
                _this.blockHasBeenSelected = true;
                _this.blockData[blockID][2] = 1;
            }
            _this.connections.map(function (x) { return console.log(x[0] + " to " + x[1]); });
            _this.setState({ connections: _this.connections, blockData: _this.blockData });
        };
        _this.clickOnAir = function (e) {
            if (_this.state.currentStatus === 1) {
                if (e.clientX < (window.innerWidth) * 0.8) {
                    var X = e.clientX - window.innerWidth / 2;
                    var Y = e.clientY - window.innerHeight / 2;
                    _this.blockData.push([X, Y, 0, new Array(0)]);
                    _this.nBlocks++;
                    _this.setState({ blockData: _this.blockData });
                    console.log(_this.blockData);
                }
            }
        };
        // Counter of the number of blocks currently in the page
        _this.nBlocks = 0;
        // blockData is an array of elements, each one representing the
        // key information of each block added to the page
        var blockData = new Array(_this.nBlocks);
        _this.blockData = blockData;
        // simulationRunning is a boolean that becomes true when the
        // "Run simulation" button is clicked.
        _this.simulationRunning = false;
        // If the initial number of blocks is over 1, these are initialized
        // with random positions. The structure of each element of the
        // blockData array consists on:
        //
        //		1. X position of the block
        //		2. Y position of the block
        //		3. An indication of whether the block is currently selected
        //		4. A list of all blocks that are connected to this one
        for (var i = 0; i < _this.nBlocks; i++) {
            _this.blockData[i] = new Array(4);
            _this.blockData[i][0] = -150 + 300 * Math.random();
            _this.blockData[i][1] = -150 + 300 * Math.random();
            _this.blockData[i][2] = 0;
            _this.blockData[i][3] = new Array(0);
        }
        // Connections array is initialized. Each element of this array consists
        // on an array of two values, indicating the index of the blocks it
        // connects.
        var nConnections = 0;
        var connections = new Array(nConnections);
        _this.connections = connections;
        // The state of the App component is initialized. The important variables
        // to track for re-rendering are the blocks, the connections and the status
        // of the App.
        // The status (currentStatus) can have three values:
        //		0 -> No blocks are being placed
        //		1 -> Clicking will place a box
        //		2 -> The simulation is running (TODO: this state should not exist)
        _this.state = {
            currentStatus: 0,
            blockData: blockData,
            connections: connections,
        };
        // Parameters of the App: actionScale relates the distance between
        // elements to the velocity they induce. Timestep sets the time for
        // updating the positions of the blocks (currently at 60 Hz).
        _this.prmt = { actionScale: 0.1, timestep: 1 / 60 };
        // These two variables are related to selection of blocks. 
        // blockHasBeenSelected indicates whether there is currently a block
        // selected. currentBlockSelected indicates the ID of this block.
        _this.blockHasBeenSelected = false;
        _this.currentBlockSelected = 0;
        return _this;
    }
    App.prototype.render = function () {
        var _this = this;
        var customStyle = { transform: "rotate(" + this.state.angle + "deg)" };
        return (React.createElement("div", { className: "App" },
            React.createElement("header", { className: "App-header", onClick: this.clickOnAir },
                React.createElement(UserInterface, { currentStatus: this.state.currentStatus, changeCurrentStatusFunction: this.changeCurrentStatus }),
                this.connections.map(function (x) {
                    return React.createElement(ConnectBar, { x0: _this.state.blockData[x[0]][0], y0: _this.state.blockData[x[0]][1], x1: _this.state.blockData[x[1]][0], y1: _this.state.blockData[x[1]][1] });
                }),
                __spreadArray([], __read(Array(this.nBlocks).keys())).map(function (x) { return React.createElement(Block, { data: _this.state.blockData[x], name: x, clickFunction: function () { return _this.clickOnBlock(x); } }); }))));
    };
    return App;
}(React.Component));
var UserInterface = /** @class */ (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface(props) {
        return _super.call(this, props) || this;
    }
    UserInterface.prototype.render = function () {
        var _this = this;
        if (this.props.currentStatus === 0 || this.props.currentStatus == 2) {
            var addBlockMessage = "Add block";
            var addBlockFunction = function () { return _this.props.changeCurrentStatusFunction(1); };
        }
        else {
            var addBlockMessage = "Stop adding blocks";
            var addBlockFunction = function () { return _this.props.changeCurrentStatusFunction(0); };
        }
        return (React.createElement("div", { className: "userInterface" },
            React.createElement("div", { className: "userButton", onClick: addBlockFunction }, addBlockMessage),
            React.createElement("div", { className: "userButton", onClick: function () { return _this.props.changeCurrentStatusFunction(2); } }, "Run simulation")));
    };
    return UserInterface;
}(React.Component));
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(props) {
        return _super.call(this, props) || this;
    }
    Block.prototype.render = function () {
        var positionData = {
            transform: "translate(" + this.props.data[0] + "px, " + this.props.data[1] + "px)",
            outlineStyle: "none"
        };
        if (this.props.data[2] === 1) {
            positionData.outlineStyle = "solid";
        }
        return (React.createElement("div", { className: "myBlock", style: positionData, onClick: this.props.clickFunction }, this.props.name));
    };
    return Block;
}(React.Component));
var ConnectBar = /** @class */ (function (_super) {
    __extends(ConnectBar, _super);
    function ConnectBar(props) {
        return _super.call(this, props) || this;
    }
    ConnectBar.prototype.render = function () {
        var x_position = (this.props.x0 + this.props.x1) / 2;
        var y_position = (this.props.y0 + this.props.y1) / 2;
        var angle = -Math.atan2((this.props.x1 - this.props.x0), (this.props.y1 - this.props.y0)) * 180 / Math.PI;
        var length = Math.pow(Math.pow(this.props.y1 - this.props.y0, 2) + Math.pow(this.props.x1 - this.props.x0, 2), 0.5);
        var customStyle = {
            transform: "translate( " + x_position + "px, " + y_position + "px) rotate(" + angle + "deg)",
            height: length + "px"
        };
        return React.createElement("div", { className: "connectionBar", style: customStyle });
    };
    return ConnectBar;
}(React.Component));
export default App;
