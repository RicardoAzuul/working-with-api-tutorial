// type is the type of data we get from the API: people, planets, et cetera
function getData(url, callBack) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callBack(JSON.parse(this.responseText));
		}
	};

    xhr.open("GET", url);
	xhr.send();
}

function getTableHeaders (object) {
    let tableHeaders = [];

    Object.keys(object).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);
    });

    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    }
    else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;                
    }
    else if (!mext && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

function writeToDocument(url) {
    let tableRows = [];
    let el = document.getElementById('data');
    el.innerHTML = '';
    
    getData(url, function(data) { // function without a name is an anonymous function
        let pagination;
        if (data.next || data.previous) { // .next and .previous are properties of the data returned by the API, indicating that there is more than 10 rows of data
            pagination = generatePaginationButtons(data.next, data.previous);
        }

        data = data.results;
        let tableHeaders = getTableHeaders(data[0]);

        data.forEach(function(item) {
            let dataRow = [];

            Object.keys(item).forEach(function(key) {
                let rowData = item[key].toString();
                let truncatedData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncatedData}</td>`) // push the key (value) for each item at the end of dataRow array
            });

            tableRows.push(`<tr>${dataRow}</tr>`);
        });
        
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, ''); // regex to get rid of all the commas
    });
}

