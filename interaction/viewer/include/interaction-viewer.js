var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference types="tstl" />
/// <reference types="samchon" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        viewer.library = samchon.library;
        viewer.collections = samchon.collections;
        viewer.protocol = samchon.protocol;
        viewer.INTERVAL = 1;
        viewer.WIDTH = 1500;
        viewer.HEIGHT = 1000;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var Application = (function (_super) {
            __extends(Application, _super);
            /* ---------------------------------------------------------
                CONSTRUCTOR
            --------------------------------------------------------- */
            function Application() {
                var _this = _super.call(this) || this;
                _this.system_tree_ = new viewer.SystemTree();
                _this.message_array_ = new std.Deque();
                _this.connector_ = new viewer.protocol.WebServerConnector(_this);
                _this.connector_.connect("127.0.0.1", 37950);
                return _this;
            }
            Object.defineProperty(Application.prototype, "systemTreeViewer", {
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                get: function () {
                    return this.refs["systemTreeViewer"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "messageArrayViewer", {
                get: function () {
                    return this.refs["messageArrayViewer"];
                },
                enumerable: true,
                configurable: true
            });
            /* ---------------------------------------------------------
                INVOKE MESSAGE HANDLERS
            --------------------------------------------------------- */
            Application.prototype.sendData = function (invoke) {
                this.connector_.sendData(invoke);
            };
            Application.prototype.replyData = function (invoke) {
                invoke.apply(this);
            };
            Application.prototype.setSystems = function (xml) {
                // CONSTRUCT SYSTEM_TREE
                this.system_tree_.construct(xml);
                // PRINT ON SCREEN
                this.systemTreeViewer.setState({});
            };
            Application.prototype.printSendData = function (from, to, listener) {
                // CREATE MESSAGE
                var message = new viewer.Message(this.system_tree_, from, to, listener);
                this.message_array_.push_back(message);
                // PRINT ON SCREEN
                this.systemTreeViewer.printMessage(message);
                this.messageArrayViewer.setState({}); // REFRESH
            };
            /* ---------------------------------------------------------
                RENDERER
            --------------------------------------------------------- */
            Application.prototype.render = function () {
                return React.createElement("div", { id: "main_div", width: "100%", height: "100%" },
                    React.createElement(viewer.MessageArrayViewer, { ref: "messageArrayViewer", application: this, messageArray: this.message_array_, style: { width: 450, height: "100%",
                            position: "absolute", left: 15, top: 15 } }),
                    React.createElement(viewer.SystemTreeViewer, { ref: "systemTreeViewer", application: this, systemTree: this.system_tree_, style: { position: "absolute", left: 500, top: 15 } }));
            };
            /* ---------------------------------------------------------
                MAIN
            --------------------------------------------------------- */
            Application.main = function () {
                ReactDOM.render(React.createElement(Application, null), document.body);
            };
            return Application;
        }(React.Component));
        viewer.Application = Application;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var Message = (function () {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function Message(systemMap, from, to, listener) {
                this.system_map_ = systemMap;
                this.no_ = ++Message.s_iNo;
                this.from_ = from;
                this.to_ = to;
                this.listener_ = listener;
                this.date_ = new Date();
            }
            /* =========================================================
                ACCESSORS
                    - MEMBERS
                    - GRID PROPERTIES
            ============================================================
                MEMBERS
            --------------------------------------------------------- */
            Message.prototype.getNo = function () {
                return this.no_;
            };
            Message.prototype.getFrom = function () {
                return this.from_;
            };
            Message.prototype.getTo = function () {
                return this.to_;
            };
            Message.prototype.getListener = function () {
                return this.listener_;
            };
            Message.prototype.getDate = function () {
                return this.date_;
            };
            Object.defineProperty(Message.prototype, "$no", {
                /* ---------------------------------------------------------
                    GRID PROPERTIES
                --------------------------------------------------------- */
                get: function () {
                    return viewer.library.StringUtil.numberFormat(this.no_, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Message.prototype, "$from", {
                get: function () {
                    return viewer.library.StringUtil.substitute("{1}) {2}", viewer.library.StringUtil.numberFormat(this.from_, 0), (this.system_map_.has(this.from_) == true)
                        ? this.system_map_.get(this.from_).getName()
                        : "Disconnected");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Message.prototype, "$to", {
                get: function () {
                    return viewer.library.StringUtil.substitute("{1}) {2}", viewer.library.StringUtil.numberFormat(this.to_), (this.system_map_.has(this.to_) == true)
                        ? this.system_map_.get(this.to_).getName()
                        : "Disconnected");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Message.prototype, "$listener", {
                get: function () {
                    return this.listener_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Message.prototype, "$date", {
                get: function () {
                    return viewer.library.StringUtil.substitute("{1}:{2}:{3}", this.date_.getHours(), this.date_.getMinutes(), this.date_.getSeconds() + ((this.date_.getTime() % 1000) / 1000));
                },
                enumerable: true,
                configurable: true
            });
            return Message;
        }());
        Message.s_iNo = 0;
        viewer.Message = Message;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var System = (function (_super) {
            __extends(System, _super);
            function System(parent) {
                if (parent === void 0) { parent = null; }
                var _this = _super.call(this) || this;
                _this.uid = -1;
                _this.name = "";
                _this.parent = parent;
                return _this;
            }
            System.prototype.createChild = function (xml) {
                return new System(this);
            };
            /* ---------------------------------------------------------
                COORDINATES COMPUTATIONS
            --------------------------------------------------------- */
            System.prototype._Compute_coordinates = function () {
                this.initialize_nodes(0);
                // assign initial X and Mod values for nodes
                this.compute_initial_x();
                // ensure no node is being drawn off screen
                this.check_all_children_on_screen();
                // assign final X values to nodes
                this.compute_final_positions(0);
            };
            System.prototype.initialize_nodes = function (depth) {
                this.col_ = -1;
                this.row_ = depth;
                this.mod_ = 0;
                for (var i = 0; i < this.size(); i++)
                    this.at(i).initialize_nodes(depth + 1);
            };
            System.prototype.compute_final_positions = function (modSum) {
                this.col_ += modSum;
                modSum += this.mod_;
                for (var i = 0; i < this.size(); i++)
                    this.at(i).compute_final_positions(modSum);
            };
            System.prototype.compute_initial_x = function () {
                for (var i = 0; i < this.size(); i++)
                    this.at(i).compute_initial_x();
                // if no children
                if (this.empty() == true) {
                    // if there is a previous sibling in this set, set X to prevous sibling + designated distance
                    if (!this.is_left_most())
                        this.col_ = this.get_previous_sibling().col_ + 1;
                    else
                        // if this is the first this in a set, set X to 0
                        this.col_ = 0;
                }
                else if (this.size() == 1) {
                    // if this is the first this in a set, set it's X value equal to it's child's X value
                    if (this.is_left_most()) {
                        this.col_ = this.front().col_;
                    }
                    else {
                        this.col_ = this.get_previous_sibling().col_ + 1;
                        this.mod_ = this.col_ - this.front().col_;
                    }
                }
                else {
                    var mid = (this.front().col_ + this.back().col_) / 2;
                    if (this.is_left_most()) {
                        this.col_ = mid;
                    }
                    else {
                        this.col_ = this.get_previous_sibling().col_ + 1;
                        this.mod_ = this.col_ - mid;
                    }
                }
                if (this.size() > 0 && !this.is_left_most()) {
                    // Since subtrees can overlap, check for conflicts and shift tree right if needed
                    this.check_conflicts();
                }
            };
            System.prototype.check_conflicts = function () {
                var min_distance = 1;
                var shift_value = 0.0;
                var contour = new std.TreeMap();
                this.get_left_contour(0, contour);
                var sibling = this.get_left_most_sibling();
                while (sibling != null && sibling != this) {
                    var sibling_contour = new std.TreeMap();
                    sibling.get_right_contour(0, sibling_contour);
                    for (var level = this.row_ + 1; level <= Math.min(sibling_contour.rbegin().first, contour.rbegin().first); level++) {
                        var distance = contour.get(level) - sibling_contour.get(level);
                        if (distance + shift_value < min_distance) {
                            shift_value = min_distance - distance;
                        }
                    }
                    if (shift_value > 0) {
                        this.col_ += shift_value;
                        this.mod_ += shift_value;
                        this.center_nodes_between(this, sibling);
                        shift_value = 0;
                    }
                    sibling = sibling.get_next_sibling();
                }
            };
            System.prototype.center_nodes_between = function (leftNode, rightNode) {
                var leftIndex = std.find(leftNode.parent.begin(), leftNode.parent.end(), rightNode).index();
                var rightIndex = std.find(leftNode.parent.begin(), leftNode.parent.end(), leftNode).index();
                var numNodesBetween = (rightIndex - leftIndex) - 1;
                if (numNodesBetween > 0) {
                    var distanceBetweenNodes = (leftNode.col_ - rightNode.col_) / (numNodesBetween + 1);
                    var count = 1;
                    for (var i = leftIndex + 1; i < rightIndex; i++) {
                        var middleNode = leftNode.parent.at(i);
                        var desiredX = rightNode.col_ + (distanceBetweenNodes * count);
                        var offset = desiredX - middleNode.col_;
                        middleNode.col_ += offset;
                        middleNode.mod_ += offset;
                        count++;
                    }
                    leftNode.check_conflicts();
                }
            };
            System.prototype.check_all_children_on_screen = function () {
                var contour = new std.TreeMap();
                this.get_left_contour(0, contour);
                var shiftAmount = 0;
                for (var it = contour.begin(); !it.equals(contour.end()); it = it.next())
                    if (it.first + shiftAmount < 0)
                        shiftAmount = it.first * -1;
                if (shiftAmount > 0) {
                    this.col_ += shiftAmount;
                    this.mod_ += shiftAmount;
                }
            };
            System.prototype.get_left_contour = function (modSum, values) {
                var it = values.find(this.row_);
                if (it.equals(values.end()) == true)
                    values.insert([this.row_, this.col_ + modSum]);
                else
                    it.second = Math.min(it.second, this.col_ + modSum);
                modSum += this.mod_;
                for (var i = 0; i < this.size(); i++)
                    this.at(i).get_left_contour(modSum, values);
            };
            System.prototype.get_right_contour = function (modSum, values) {
                var it = values.find(this.row_);
                if (it.equals(values.end()) == true)
                    values.insert([this.row_, this.col_ + modSum]);
                else
                    it.second = Math.max(it.second, this.col_ + modSum);
                modSum += this.mod_;
                for (var i = 0; i < this.size(); i++)
                    this.at(i).get_right_contour(modSum, values);
            };
            /* =========================================================
                ACCESSORS
                    - MEMBERS
                    - NODES
            ============================================================
                MEMBERS
            --------------------------------------------------------- */
            System.prototype.key = function () {
                return this.uid;
            };
            System.prototype.getUID = function () {
                return this.uid;
            };
            System.prototype.getName = function () {
                return this.name;
            };
            System.prototype.getX = function () {
                return this.col_ * 150;
            };
            System.prototype.getY = function () {
                return this.row_ * 175;
            };
            /* ---------------------------------------------------------
                NODES
            --------------------------------------------------------- */
            System.prototype.is_left_most = function () {
                return this.parent == null || this.parent.front() == this;
            };
            System.prototype.is_right_most = function () {
                return this.parent == null || this.parent.back() == this;
            };
            System.prototype.get_previous_sibling = function () {
                if (this.parent == null || this.is_left_most() == true)
                    return null;
                else
                    return std.find(this.parent.begin(), this.parent.end(), this).prev().value;
            };
            System.prototype.get_next_sibling = function () {
                if (this.parent == null || this.is_right_most() == true)
                    return null;
                else
                    return std.find(this.parent.begin(), this.parent.end(), this).next().value;
            };
            System.prototype.get_left_most_sibling = function () {
                if (this.parent == null)
                    return null;
                else
                    return this.parent.front();
            };
            System.prototype.get_right_most_sibling = function () {
                if (this.parent == null)
                    return null;
                else
                    return this.parent.back();
            };
            System.prototype.get_left_most_child = function () {
                if (this.empty() == true)
                    return null;
                else
                    return this.front();
            };
            System.prototype.get_right_most_child = function () {
                if (this.empty() == true)
                    return null;
                else
                    return this.back();
            };
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
            System.prototype.TAG = function () {
                return "system";
            };
            System.prototype.CHILD_TAG = function () {
                return this.TAG();
            };
            return System;
        }(viewer.protocol.EntityArray));
        viewer.System = System;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var SystemTree = (function (_super) {
            __extends(SystemTree, _super);
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function SystemTree() {
                var _this = _super.call(this) || this;
                _this.rootNode = new viewer.System();
                return _this;
            }
            SystemTree.prototype.construct = function (xml) {
                // CONSTRUCT SYSTEMS
                this.rootNode.construct(xml);
                // LINKS TO MAP
                this.clear();
                this.explore_children(this.rootNode);
                // COMPUTE COORDINATES
                this.rootNode._Compute_coordinates();
            };
            SystemTree.prototype.explore_children = function (system) {
                this.insert([system.getUID(), system]);
                for (var i = 0; i < system.size(); i++)
                    this.explore_children(system.at(i));
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            SystemTree.prototype.getRoot = function () {
                return this.rootNode;
            };
            return SystemTree;
        }(std.TreeMap));
        viewer.SystemTree = SystemTree;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var MessageArrayViewer = (function (_super) {
            __extends(MessageArrayViewer, _super);
            function MessageArrayViewer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MessageArrayViewer.prototype.get_row = function (index) {
                return this.props.messageArray.at(index);
            };
            MessageArrayViewer.prototype.handle_change = function (event) {
                try {
                    var message = this.props.messageArray.at(event.rowIdx);
                    this.props.application.systemTreeViewer.printMessage(message);
                }
                catch (exception) { }
            };
            MessageArrayViewer.prototype.render = function () {
                var columns = [
                    { key: "$no", name: "No", width: 50 },
                    { key: "$from", name: "From", width: 100 },
                    { key: "$to", name: "To", width: 100 },
                    { key: "$listener", name: "Listener", width: 100 },
                    { key: "$date", name: "Datetime", width: 70 }
                ];
                return React.createElement("div", { style: this.props.style },
                    React.createElement(ReactDataGrid, { rowGetter: this.get_row.bind(this), rowsCount: this.props.messageArray.size(), columns: columns, enableCellSelect: true, onCellSelected: this.handle_change.bind(this) }));
            };
            return MessageArrayViewer;
        }(React.Component));
        viewer.MessageArrayViewer = MessageArrayViewer;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var MessageMovie = (function (_super) {
            __extends(MessageMovie, _super);
            function MessageMovie() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MessageMovie.prototype.render = function () {
                var message = this.props.message;
                var from = this.props.systemTree.get(message.getFrom());
                var to = this.props.systemTree.get(message.getTo());
                return React.createElement("svg", { width: viewer.WIDTH, height: viewer.HEIGHT },
                    React.createElement("g", null,
                        React.createElement("animateTransform", { attributeName: "transform", type: "translate", from: viewer.library.StringUtil.substitute("{1} {2}", from.getX() + 50, from.getY() + 65), to: viewer.library.StringUtil.substitute("{1} {2}", to.getX() + 50, to.getY() + 65), begin: "0s", dur: viewer.INTERVAL + "s", repeatCount: "1" }),
                        React.createElement("circle", { r: 4, fill: (from.getY() < to.getY()) ? "blue" : "green" }),
                        React.createElement("text", { x: 10 },
                            message.getNo(),
                            ") ",
                            message.getListener())));
            };
            return MessageMovie;
        }(React.Component));
        viewer.MessageMovie = MessageMovie;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var SystemMovie = (function (_super) {
            __extends(SystemMovie, _super);
            function SystemMovie() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SystemMovie.prototype.render = function () {
                // SYSTEM TO BE REPRESENTED
                var system = this.props.system;
                // IMAGE TO REPRESENT THE SYSTEM
                var image = "system";
                if (system.getName().indexOf("Chief") != -1)
                    image = "chief";
                else if (system.getName().indexOf("Master") != -1)
                    image = "master";
                else if (system.getName().indexOf("Mediator") != -1)
                    image = "mediator";
                else if (system.getName().indexOf("Slave") != -1)
                    image = "slave";
                return React.createElement("g", { transform: "translate(" + system.getX() + ", " + system.getY() + ")" },
                    React.createElement("image", { xlinkHref: "images/" + image + ".png", width: 100, height: 100 }),
                    React.createElement("text", { textAnchor: "middle", x: 50, y: 120 },
                        system.getUID(),
                        ". ",
                        system.getName()));
                //return <div style={{position: "absolute", backgroundColor: "skyblue",
                //					left: system.getX() - 50, top: system.getY() - 50}}>
                //	<table style={{textAlign: "center"}}>
                //		<tr><td><img src={"images/" + image + ".png"} /></td></tr>
                //		<tr><td>{system.getUID()}. {system.getName()}</td></tr>
                //	</table>
                //</div>;
            };
            return SystemMovie;
        }(React.Component));
        viewer.SystemMovie = SystemMovie;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="../API.ts" />
var interaction;
(function (interaction) {
    var viewer;
    (function (viewer) {
        var SystemTreeViewer = (function (_super) {
            __extends(SystemTreeViewer, _super);
            function SystemTreeViewer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SystemTreeViewer.prototype.printMessage = function (message) {
                // NO MATCHED SYSTEM (ALREADY DISCONNECTED), THEN TERMINATE
                var system_tree = this.props.systemTree;
                if (!system_tree.has(message.getFrom()) || !system_tree.has(message.getTo()))
                    return;
                // CREATE DIV
                var div = document.createElement("div");
                div.style.position = "absolute";
                div.style.left = "500";
                div.style.top = "15";
                // APPEND AND RENDER
                document.getElementById("main_div").appendChild(div);
                ReactDOM.render(React.createElement(viewer.MessageMovie, { systemTree: system_tree, message: message }), div);
                // REMOVE THIS DIV 2 SECONDS AFTER
                setTimeout(function () {
                    document.getElementById("main_div").removeChild(div);
                }, viewer.INTERVAL * 1000);
            };
            SystemTreeViewer.prototype.render = function () {
                var system_tree = this.props.systemTree;
                var system_movie_elements = [];
                for (var it = system_tree.begin(); !it.equals(system_tree.end()); it = it.next())
                    system_movie_elements.push(React.createElement(viewer.SystemMovie, { system: it.second }));
                return React.createElement("div", { style: this.props.style },
                    React.createElement("svg", { id: "systems_svg", width: viewer.WIDTH, height: viewer.HEIGHT },
                        this.render_lines(this.props.systemTree.getRoot()),
                        system_movie_elements));
            };
            SystemTreeViewer.prototype.render_lines = function (system) {
                var lines = [];
                for (var i = 0; i < system.size(); i++) {
                    var child_system = system.at(i);
                    lines.push(React.createElement("line", { stroke: "gray", strokeWidth: 1, x1: system.getX() + 50, y1: system.getY() + 65, x2: child_system.getX() + 50, y2: child_system.getY() + 65 }));
                    lines.push.apply(lines, this.render_lines(child_system));
                }
                return lines;
            };
            return SystemTreeViewer;
        }(React.Component));
        SystemTreeViewer.s_iSequence = 0;
        viewer.SystemTreeViewer = SystemTreeViewer;
    })(viewer = interaction.viewer || (interaction.viewer = {}));
})(interaction || (interaction = {}));
