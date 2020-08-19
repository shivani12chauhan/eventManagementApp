var $clearBtn = document.getElementById('clear_button');
var $submitBtn = document.getElementById('submit_button');
var $eventName = document.getElementById('event_name');
var $desc = document.getElementById('desc');
var $venue = document.getElementById('venue');
var $price = document.getElementById('price');
var $discount = document.getElementById('discount');
var $eventsTable = document.getElementById('events_table');
var $filter = document.getElementById('filter');
var $validatoryHelp = document.getElementById('validatory_help');
var $eventsTableBody = $('#events_table tbody');
var eventsTableData = [];

function clearForm() {
    $eventName.value = '';
    $desc.value = '';
    $venue.value = '';
    $price.value = '';
    $discount.value = '';
}

function populateTableRow(valuesObject, tableRow) {
    if (valuesObject.eventName || valuesObject.desc || valuesObject.venue || valuesObject.price || valuesObject.discount) {
        for (var j=0; j<5; j++) {
            var tableData = document.createElement('td');
            tableData.width='105';
            switch(j) {
                case 0:
                    tableData.appendChild(document.createTextNode(valuesObject.eventName));
                    break;
                case 1:
                    tableData.appendChild(document.createTextNode(valuesObject.desc));
                    break;
                case 2:
                    tableData.appendChild(document.createTextNode(valuesObject.venue));
                    break;
                case 3:
                    tableData.appendChild(document.createTextNode(valuesObject.price));
                    break;
                case 4:
                    if (valuesObject.discount) {
                        tableData.appendChild(document.createTextNode(valuesObject.discount + ' %'));
                    } else {
                        tableData.appendChild(document.createTextNode(0 + ' %'));
                    }
                    break;
            }
            tableRow.appendChild(tableData);
        }
    }
}

function submitForm() {
    var validFlag = true;
    if (!$eventName.value) {
        validFlag = false;
        $($eventName).next().removeClass('hide');
    } else {
        $($eventName).next().addClass('hide');
    }
    if (!$venue.value) {
        validFlag = false;
        $($venue).next().removeClass('hide');
    } else {
        $($venue).next().addClass('hide');
    }
    if (!$price.value || isNaN($price.value)) {
        validFlag = false;
        $($price).next().removeClass('hide');
        if (!$price.value) {
            $($price).next()[0].textContent = 'Price is a required field.';
        } else {
            $($price).next()[0].textContent = 'Price should be a number.';
        }
    } else {
        $($price).next().addClass('hide');
    }
    if (parseInt($discount.value) < 0 || parseInt($discount.value) > 100) {
        validFlag = false;
        $($discount).next().removeClass('hide');
    } else {
        $($discount).next().addClass('hide');
    }
    var valuesObject = {
        eventName: $eventName.value,
        desc: $desc.value,
        venue: $venue.value,
        price: $price.value,
        discount: $discount.value ? $discount.value : 0
    };

    var tableRow = document.createElement('tr');
    $eventsTableBody.append(tableRow);
    if (validFlag) {
        populateTableRow(valuesObject, tableRow);
        eventsTableData.push(valuesObject);
        localStorage.eventsTableData = JSON.stringify(eventsTableData);
        clearForm();
    }
}

function setInitialValues() {
    $discount.value = 0;
}

function attachListeners() {
    $($price).on('change', function() {
        if(this.value && !isNaN($price.value)) {
            this.value = parseFloat(this.value).toFixed(2);
        }
    });
    $($filter).on('change', function() {
        for(var i=1; i<$eventsTable.rows.length;) {
            $eventsTable.deleteRow(i);
        }

        var selectedValue = this.value;
        var filteredRecords = [];
        switch (selectedValue) {
            case 'all':
                filteredRecords = eventsTableData;
                break;
            case 'free':
                for(var i=0; i<eventsTableData.length; i++) {
                    if(eventsTableData[i] && (eventsTableData[i].price === '0' || parseInt(eventsTableData[i].discount) === 100)) {
                        filteredRecords.push(eventsTableData[i]);
                    }
                }
                break;
            case 'discount':
                for(var i=0; i<eventsTableData.length; i++) {
                    if(eventsTableData[i] && parseInt(eventsTableData[i].discount) > 0) {
                        filteredRecords.push(eventsTableData[i]);
                    }
                }
                break;
            case 'no_discount':
                for(var i=0; i<eventsTableData.length; i++) {
                    if(eventsTableData[i] && parseInt(eventsTableData[i].discount) === 0) {
                        filteredRecords.push(eventsTableData[i]);
                    }
                }
                break;
        }
        for (var i=0; i<filteredRecords.length; i++) {
            var tableRow = document.createElement('tr');
            $eventsTableBody.append(tableRow);
            populateTableRow(filteredRecords[i], tableRow);
        }
    });
    // for FF, IE11 and Edge when we enter non-numeric characters
    $($discount).on('blur', function() {
        if(this.value === '') {
            this.value = '';
        }
    });
}

window.onload = function() {
    if (localStorage.eventsTableData) {
        eventsTableData = JSON.parse(localStorage.eventsTableData);
    }
    for (var i=0; i<eventsTableData.length; i++) {
        var tableRow = document.createElement('tr');
        $eventsTableBody.append(tableRow);
        var valuesObject = eventsTableData[i];
        populateTableRow(valuesObject, tableRow);
    }
    this.setInitialValues();
    this.attachListeners();
}
