/*
 * I am the inspector panel.
 * I handle incoming messages from background and
 * send sometimes inject scripts directly into the target
 * window.
 *
 * I also handle how the information is displayed.
 */

var clearButton = document.getElementById("clear-button");
var tablulatordata = [];

var idClick = function(e, cell) {
    console.log("cell clicked");
    var celltext = cell.getValue()
    var id = celltext.match(/\(id=(.*)\)/)[1]
    if (id) {
        var inspectCommand = `inspect(document.querySelector('[part-id="${id}"]'))`;
        browser.devtools.inspectedWindow.eval(inspectCommand).then(handleResult);
    }
}

var table = new Tabulator("#tabulator-table", {
    // height:600, having a set height of table enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    // if performance becomes a problem, go back to this solution
    maxHeight:"100%",
    data:tablulatordata, //assign data to table
    reactiveData:true,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[
        {title:"Time", field:"time", width:150},
        {title:"Message", field:"message", headerFilter:true, formatter:"textarea"},
        {title:"Sender", field:"sender", headerFilter:true, formatter:"textarea", cellClick: idClick},
        {title:"Receiver", field:"receiver", headerFilter:true, formatter:"textarea", cellClick: idClick} ,
        {title:"Tree", field:"tree", formatter:"textarea"} ,
    ],
    // by default, this library doesn't apply existing filters to new rows, so here we manually reset
    // those column filters when a new row shows up
    rowAdded:function(row){
        filters = table.getHeaderFilters();
        table.clearFilter(true);
        filters.forEach(function (filter) {
            table.setHeaderFilterValue(filter.field, filter.value);
        });
    },
});

clearButton.onclick = function() {
    console.log("clearing data")
    while (tablulatordata.length > 0) {
        tablulatordata.shift()
    }
}

// recursively produce a stringified version of
// the tree, using a tabbed display of underscores
// to represent the node-to-child relationship
function tabularizeTree(node, tabCount) {
    var s = "__".repeat(tabCount);
    s += node.type + `(id=${node.id})` + "\n";
    node.children.forEach(child => {
        s += tabularizeTree(child, tabCount + 1)
    })
    return s;
}

function handleMessageFromBackground(msg) {
    console.log("getting message from background");

    let now = new Date();
    var j = {
        time: now.toLocaleTimeString([], {hour12: false}) + `.${now.getMilliseconds()}`,
        message: JSON.stringify(msg.msg, null, '\t'),
        sender: `${msg.source.name} (id=${msg.source.id})`,
        receiver: `${msg.target.name} (id=${msg.target.name})`,
        tree: tabularizeTree(msg.tree, 0),
    }
    tablulatordata.push(j)
}

function _prepMessage(msg){
    let td = document.createElement("td");
    let pre = document.createElement("pre");
    pre.textContent = JSON.stringify(msg, null, '\t');
    td.appendChild(pre);
    return td;
}

function handleResult(result){
    if(result[1]){
        console.error(result);
    }
}
