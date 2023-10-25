const reportTable = document.getElementById("reportTable");
const reportType = document.getElementById("reportType");
const reportMonth = document.getElementById("reportMonth");
const reportYear = document.getElementById("reportYear");
const piechartid = document.getElementById("piechart");
const orderChartid=document.getElementById("orderChart");
google.charts.load('current', {'packages':['corechart']});
let orders;
const Table = {
    newcol: function (data) {
        const col = document.createElement("td");
        col.className = "column";
        col.innerText = data;
        return col;
    },
    newrow: function () {
        const row = document.createElement("tr");
        return row;
    }
}

var currentYear = (new Date()).getFullYear();
//Loop and add the Year values to DropDownList.
for (var i = 2000; i <= currentYear; i++) {
    var option = document.createElement("option");
    option.innerHTML = i;
    option.value = i;
    reportYear.appendChild(option);
}

reportMonth.value = new Date().getMonth();
reportYear.value = currentYear;
getMonthlyData(new Date().getMonth() + 1, new Date().getFullYear());

function piechart() {
    // google.charts.load('current', { 'packages': ['corechart'] });
    let n=reportTable.rows.length;
    let receive = [];
    let r = [];
    
    const product = reportTable.rows[0].cells[1].innerText;
    const rec = "order received";
    r.push(product);
    r.push(rec);
    receive.push(r);

    
    for (var i = 1; i < n - 1; i++) {
        let r = [];
        const product = reportTable.rows[i].cells[1].innerText;
        const rec = reportTable.rows[i].cells[2].innerText;
        r.push(product);
        r.push(parseInt(rec));
        receive.push(r);
    }
    // console.log(receive);
    // console.log(google.visualization);
    var dataR = google.visualization.arrayToDataTable(receive);
    var options = { 'title': 'Piechart of orders according to product', 'width': 600, 'height': 400,'backgroundColor': '#f0f0f0' };
    var chart = new google.visualization.PieChart(piechartid);
    chart.draw(dataR, options);

    let ord=[];
    let o=[];
    o.push("order type");
    o.push("No of orders");
    ord.push(o);
    o=[];
    let pending=parseInt(reportTable.rows[n-1].cells[1].innerText)-parseInt(reportTable.rows[n-1].cells[2].innerText)-parseInt(reportTable.rows[n-1].cells[3].innerText);
    o.push("pending");
    o.push(pending);
    ord.push(o);
    o=[];
    o.push("cancelled");
    o.push(parseInt(reportTable.rows[n-1].cells[2].innerText));
    ord.push(o);
    o=[];
    o.push("delivered");
    o.push(parseInt(reportTable.rows[n-1].cells[3].innerText));
    ord.push(o);
    o=[];
    // console.log(ord);
    var dataO = google.visualization.arrayToDataTable(ord);
    var opt = { 'title': 'Piechart of orders', 'width': 600, 'height': 400,'backgroundColor': '#f0f0f0' };
    var chartO = new google.visualization.PieChart(orderChartid);
    chartO.draw(dataO, opt);
}

function getMonthlyData(month, year) {
    fetch("/seller/monthlyReport", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ month, year })
    }).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        // console.log(data);
        orders = data;
        if (data[0]) {
            addInTable(data);
        }
    }).catch(function (err) {
        console.log("something went wrong",err);
    });
}

function getYearlylyData(year) {
    fetch("/seller/yearlyReport", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ year })
    }).then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            console.log("something went wrong");
        }
    }).then(function (data) {
        orders = data;
        // console.log(data);
        if (data[0]) {
            addInTable(data);
        }
    }).catch(function (err) {
        console.log("something went wrong");
    });
}

reportType.addEventListener("change", function (ev) {
    if (reportType.value == "monthly") {
        reportMonth.disabled = false;
        while (reportTable.children[1]) {
            reportTable.removeChild(reportTable.children[1]);
        }
        piechartid.innerHTML=""
        orderChartid.innerHTML="";
        getMonthlyData(parseInt(reportMonth.value) + 1, parseInt(reportYear.value));
    }
    else {
        reportMonth.disabled = true;
        while (reportTable.children[1]) {
            reportTable.removeChild(reportTable.children[1]);
        }
        piechartid.innerHTML=""
        orderChartid.innerHTML="";
        getYearlylyData(parseInt(reportYear.value));
    }
});

reportMonth.addEventListener("change", function (ev) {
    if (reportType.value == "monthly") {
        while (reportTable.children[1]) {
            reportTable.removeChild(reportTable.children[1]);
        }
        piechartid.innerHTML=""
        orderChartid.innerHTML="";
        getMonthlyData(parseInt(reportMonth.value) + 1, parseInt(reportYear.value));
    }
});
reportYear.addEventListener("change", function (ev) {
    if (reportType.value == "monthly") {
        while (reportTable.children[1]) {
            reportTable.removeChild(reportTable.children[1]);
        }
        piechartid.innerHTML=""
        orderChartid.innerHTML="";
        getMonthlyData(parseInt(reportMonth.value) + 1, parseInt(reportYear.value));
    }
    else {
        while (reportTable.children[1]) {
            reportTable.removeChild(reportTable.children[1]);
        }
        piechartid.innerHTML="";
        orderChartid.innerHTML="";
        getYearlylyData(parseInt(reportYear.value));
    }
});

function addInTable(data, trec = 0, tcanc = 0, tdel = 0) {
    const item = data[0];
    let received = 0;
    let cancelled = 0;
    let delivered = 0;
    data = data.filter(i => {
        if (i.pid != item.pid) {
            return true;
        }
        else {
            received = received + i.quantity;
            if (i.orderstatus == "cancelled") {
                cancelled = cancelled + i.quantity;
            }
            if (i.orderstatus == "delivered") {
                delivered = delivered + i.quantity;
            }
            return false;
        }
    });

    const row = Table.newrow();
    row.appendChild(Table.newcol(item.pid));
    row.appendChild(Table.newcol(item.name));
    trec = trec + received;
    row.appendChild(Table.newcol(received));
    tcanc = tcanc + cancelled;
    row.appendChild(Table.newcol(cancelled));
    tdel = tdel + delivered;
    row.appendChild(Table.newcol(delivered));
    reportTable.appendChild(row);

    if (data[0]) {
        addInTable(data, trec, tcanc, tdel);
    }
    else {
        const lastrow = Table.newrow();
        const total = Table.newcol("Total");
        total.colSpan = 2;
        lastrow.appendChild(total);
        lastrow.appendChild(Table.newcol(trec));
        lastrow.appendChild(Table.newcol(tcanc));
        lastrow.appendChild(Table.newcol(tdel));
        reportTable.appendChild(lastrow);
        // piechart();
         google.charts.setOnLoadCallback(piechart)
    }
}