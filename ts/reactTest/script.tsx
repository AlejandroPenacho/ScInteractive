class Square extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 0, retarded_value: 0, printOutline: false};
        this.start_movement = () => {
            let new_retarded_value = this.state.retarded_value + 1;
            setTimeout(() => {
                    if (this.state.value > this.state.retarded_value) {
                        this.setState({retarded_value : this.state.retarded_value + 1});
                        this.start_movement();
                    }},
                    400/(this.state.value - new_retarded_value + 1));}
    }

    add_one = () => {
        if (this.state.value < 100){
            let runTimer = (this.state.value == this.state.retarded_value);
            this.setState({value: this.state.value + 10})
            if (runTimer) {
                this.start_movement();
            } 
        }
    }
    
    add_outline = () => {
        this.setState({printOutline: true});
    }

    remove_outline = () => {
        this.setState({printOutline: false});
    }

    render() {
        var sty = {
            width: this.state.retarded_value + '%'
        }

        if (this.state.retarded_value == 100){
            sty.backgroundColor = "green";
        } else {
            sty.backgroundColor = "grey";
        }
        
        var  mainBodyStyle = { outlineStyle : 'none' };

        if (this.state.printOutline) {
            mainBodyStyle.borderStyle = 'solid';
        } else {
            mainBodyStyle.borderStyle = 'none';
        }

        return (
            <div className="theButton"  style={mainBodyStyle} onClick={this.add_one} onMouseEnter={() => {this.add_outline(); console.log("IN")}} onMouseOut={this.remove_outline}>
                <div className="secondButton" style={sty}>
                </div>
                <div className="textyle">
                    ({this.state.retarded_value}%)
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Square />, document.getElementById("root"));