$('body').append("<table></table>");

$('table').append("<tr></tr>")

$('tr').append("<th>Row</th>");

let userData;
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        userData = JSON.parse(xhttp.responseText).data;
    }
    else if (xhttp.readyState === 4 && xhttp.status !== 200) console.log("Error - Not found");
}
xhttp.open("GET", "https://reqres.in/api/users?page=2", false);
xhttp.send();

let i = 0;
for (const key in userData[0]) {
    $('tr').append(`<th>${key}</th>`);
    let th = $('th')[i + 1];
    th.setAttribute('onclick', `sort(${i})`);
    i++
    $('.modal-content-keys').append(`<div id='${key}' class='field'>${key}:</div>`);
};
$('tr').append("<th>Modification</th>");


for (let i = 0; i < userData.length; i++) {//Each Row (users)
    $('table').append("<tr></tr>");
    let td = document.createElement("td"); td.innerText = `${i + 1}`; td.setAttribute('id', `${i}`); $('tr')[i + 1].appendChild(td)//Rows

    for (const key in userData[i]) {//Each Cell (properties of user)
        if (key !== "avatar") {
            let td = document.createElement("td"); td.innerText = `${userData[i][key]}`; td.setAttribute('id', `${i}`);
            $('tr')[i + 1].append(td)
        } else {
            let td = document.createElement("td"); td.innerHTML = `<img class="imgAvatar" id="${i}" src="${userData[i][key]}" alt="Avatar picture">`; td.setAttribute('id', `${i}`);
            $('tr')[i + 1].append(td)
        };
    };
    td = document.createElement("td"); td.innerText = `Modify Row ${i + 1}`; td.setAttribute('id', `${i}`); td.setAttribute('modify', `true`); td.setAttribute('class', `modify`)
    $('tr')[i + 1].appendChild(td)
}
let I = userData.length;
$('table').append("<tr></tr>");
td = document.createElement("td"); td.innerText = `Add`; td.setAttribute('id', `${I}`); td.setAttribute('add', `true`); td.setAttribute('class', `add`)
$('tr')[I + 1].appendChild(td)


//----------------------------------------------------------------------------------------------------
let sortStyle = "acc";
let lastCol = 10000;
function sort(col) {
    let rows = document.getElementsByTagName('table')[0].rows;
    let headings = Object.keys(userData[0]);

    if (lastCol === col) {
        if (sortStyle === "acc") {
            sortStyle = "dec";
            var I = -1
        } else {
            sortStyle = "acc";
            var I = 1
        }
    } else {
        sortStyle = "acc";
        var I = 1
    }

    userData.sort((a, b) => {
        if (typeof (a[headings[col]]) !== "number") {
            for (let i = 0; i < Math.min(String(a[headings[col]]).length, String(b[headings[col]]).length); i++) {
                let difference = I * String(a[headings[col]]).toLowerCase().charCodeAt(i) - I * String(b[headings[col]]).toLowerCase().charCodeAt(i);
                if (difference !== 0) return difference
            }

            return 0
        } else {
            return I * a[headings[col]] - I * b[headings[col]]
        }

    });


    for (let i = 0; i < headings.length; i++) {
        for (let row = 1; row < rows.length - 1; row++) {
            if (headings[i] !== "avatar") {
                document.getElementsByTagName('table')[0].rows[row].getElementsByTagName('td')[i + 1].innerText = userData[row - 1][headings[i]];
            } else {
                document.getElementsByTagName('table')[0].rows[row].getElementsByTagName('td')[i + 1].innerHTML = `<img class="imgAvatar" src="${userData[row - 1][headings[i]]}">`;
            }
        }
    }

    lastCol = col;
}

$('td').click((e) => Click(e));
function Click(e) {
    $('#modal').slideDown();
    if (Boolean(e.target.getAttribute('modify'))) {
        for (const key in userData[e.target.id]) {
            $('.modal-content-data').append(`<input value="${userData[e.target.id][key]}" placeholder="${userData[e.target.id][key]}" style="width: 400px">`);
        } document.getElementsByTagName('input')[0].setAttribute('disabled', "true");
        $('#btnChange').add('#btnDelete').css('display', "block")
        $('#btnChange').attr('onclick', `change(${e.target.id})`);
        $('#btnDelete').attr('onclick', `del(${e.target.id})`);
    } else if (Boolean(e.target.getAttribute('add'))) {
        for (const key in userData[0]) {
            $('.modal-content-data').append(`<input value="" placeholder="Please enter something." style="width: 400px">`);
        }
        $('#btnAdd').css('display', "block")
        $('#btnAdd').attr('onclick', `add(${e.target.id})`);
    } else {
        for (const key in userData[e.target.id]) {
            $('.modal-content-data').append(`<div>${userData[e.target.id][key]}</div>`);
        }
    }
}


$('.close').click((e) => {
    $('#modal').slideUp();
    $('.modal-content-data > *').remove();
    $('.btn').css('display', "none")
});
window.onclick = function (event) {
    if (event.target == document.getElementById('modal')) {
        $('#modal').slideUp();
        $('.modal-content-data > *').remove();
        $('.btn').css('display', "none");
    }
}

function change(id) {
    let i = 0;
    let row = document.getElementsByTagName('table')[0].rows[id + 1];
    for (const key in userData[id]) {
        if (document.getElementsByTagName('input')[i].value === "") {
            alert("Do not leave ant thing empty !!!")
            return
        }
        if (key !== "id") userData[id][key] = document.getElementsByTagName('input')[i].value;
        if (key !== "avatar") {
            row.getElementsByTagName('td')[i + 1].innerText = userData[id][key];
        } else {
            row.getElementsByTagName('td')[i + 1].innerHTML = `<img class="imgAvatar" id="${id}" src="${userData[id][key]}"></img>`;
        }

        i++;
    }

    $('#modal').slideUp();
    $('.modal-content-data > *').remove();
    $('.btn').css('display', "none")
}

function del(id) {
    let row = document.getElementsByTagName('table')[0].rows[id + 1];
    $(row).remove();
    userData.splice(id, 1);
    let rows = document.getElementsByTagName('table')[0].rows;
    for (let i = 1; i < rows.length - 1; i++) {
        rows[i].getElementsByTagName('td')[0].innerText = `${i}`;
        rows[i].getElementsByTagName('td')[rows.length - 1].innerText = `Modify Row ${i}`;
        for (const item of rows[i].getElementsByTagName('td')) {
            item.id = i - 1;
            $(item).children().attr('id', `${i - 1}`);
        }
    } rows[rows.length - 1].getElementsByTagName('td')[0].innerText = `Add`;
    rows[rows.length - 1].getElementsByTagName('td')[0].id = rows.length - 1 - 1;
    $('#modal').slideUp();
    $('.modal-content-data > *').remove();
    $('.btn').css('display', "none")
}

function add(id) {
    console.log($(`#${id}`).parent());
    if (!userData.some((e) => e.id == $('input')[0].value) && !isNaN(parseInt($('input')[0].value))) {
        let i = 0;
        userData[id] = {};
        let row = document.getElementsByTagName('table')[0].rows[id + 1];
        $(`#${id}`).parent().after(`<tr><td id="${id + 1}" add="true" class="add">Add</td></tr>`);
        row.innerHTML = `<td id="${id}">${id + 1}</td>`;
        for (const key in userData[0]) {

            if (i === 0) {
                userData[id][key] = parseInt($('input')[i].value);
                row.innerHTML += `<td id="${id}">${userData[id][key]}</td>`;
            } else if (key === "avatar") {
                userData[id][key] = $('input')[i].value;
                row.innerHTML += `<td id="${id}"><img class="imgAvatar" id="${id}" src="${userData[id][key]}"></img></td>`;
            } else {
                userData[id][key] = $('input')[i].value;
                row.innerHTML += `<td id="${id}">${$('input')[i].value}</td>`;
            }

            i++;
        } row.innerHTML += `<td id="${id}" modify="true" class="modify">Modify Row ${id + 1}</td>`;

        $('#modal').slideUp();
        $('.modal-content-data > *').remove();
        $('.btn').css('display', "none")
    } else alert("Invalid or Existed UID")

    $('td').filter(`#${id}`).add($('td').filter(`#${id + 1}`)).click((e) => Click(e));
}

$('.save').click((e) => {
    //save function
})


