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
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(props) {
        var _this = _super.call(this, props) || this;
        _this.add_one = function () {
            if (_this.state.value < 100) {
                var runTimer = (_this.state.value == _this.state.retarded_value);
                _this.setState({ value: _this.state.value + 10 });
                if (runTimer) {
                    _this.start_movement();
                }
            }
        };
        _this.add_outline = function () {
            _this.setState({ printOutline: true });
        };
        _this.remove_outline = function () {
            _this.setState({ printOutline: false });
        };
        _this.state = { value: 0, retarded_value: 0, printOutline: false };
        _this.start_movement = function () {
            var new_retarded_value = _this.state.retarded_value + 1;
            setTimeout(function () {
                if (_this.state.value > _this.state.retarded_value) {
                    _this.setState({ retarded_value: _this.state.retarded_value + 1 });
                    _this.start_movement();
                }
            }, 400 / (_this.state.value - new_retarded_value + 1));
        };
        return _this;
    }
    Square.prototype.render = function () {
        var _this = this;
        var sty = {
            width: this.state.retarded_value + '%'
        };
        if (this.state.retarded_value == 100) {
            sty.backgroundColor = "green";
        }
        else {
            sty.backgroundColor = "grey";
        }
        var mainBodyStyle = { outlineStyle: 'none' };
        if (this.state.printOutline) {
            mainBodyStyle.borderStyle = 'solid';
        }
        else {
            mainBodyStyle.borderStyle = 'none';
        }
        return (React.createElement("div", { className: "theButton", style: mainBodyStyle, onClick: this.add_one, onMouseEnter: function () { _this.add_outline(); console.log("IN"); }, onMouseOut: this.remove_outline },
            React.createElement("div", { className: "secondButton", style: sty }),
            React.createElement("div", { className: "textyle" },
                "(",
                this.state.retarded_value,
                "%)")));
    };
    return Square;
}(React.Component));
ReactDOM.render(React.createElement(Square, null), document.getElementById("root"));
