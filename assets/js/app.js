let cl = console.log;

const stdForm = document.getElementById('stdForm')
const fnameControl = document.getElementById('fname')
const lnameControl = document.getElementById('lname')
const emailControl = document.getElementById('email')
const contactControl = document.getElementById('contact')
const stdInfoContainer = document.getElementById('stdInfoContainer')
const stdTable = document.getElementById('stdTable')
const noStdData = document.getElementById('noStdData')
const noOfStds = document.getElementById('noOfStds')
const stdSubmitBtn = document.getElementById('stdSubmitBtn')
const stdUpdateBtn = document.getElementById('stdUpdateBtn')


const trtemplating = (arr) => {
    let res = ''
    arr.forEach((ele, i) => {
        res += `
                <tr id="${ele.stdId}">
                    <td>${i + 1}</td>
                    <td>${ele.fname}</td>
                    <td>${ele.lname}</td>
                    <td>${ele.email}</td>
                    <td>${ele.contact}</td>
                    <td>
                        <i class="fa-solid  fa-pen-to-square edit" onclick="onStdEdit(this)"></i>
                    </td>
                    <td>
                        <i class="fa-solid  fa-trash-can delete"
                        onclick="onStdDelete(this)"></i>
                    </td>
                </tr>
        
                    `
    })
    stdInfoContainer.innerHTML = res;

}

let stdArray = [];


if (localStorage.getItem('stdData')) {
    let data = JSON.parse(localStorage.getItem('stdData'))
    stdArray = data;
    trtemplating(data)
    stdTable.classList.remove('d-none')
    noStdData.innerHTML = `Number of Students are ${data.length}`
}
else {
    stdTable.classList.add('d-none')
    noStdData.innerHTML = 'No Student Record Found Yet !!!'
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


const onStdEdit = (ele) => {

    let editId = ele.closest('tr').getAttribute('id')
    cl(editId)
    localStorage.setItem('editId', editId)

    let editObj = stdArray.find(std => {
        return std.stdId === editId;
    })
    cl(editObj)

    fnameControl.value = editObj.fname;
    lnameControl.value = editObj.lname;
    emailControl.value = editObj.email;
    contactControl.value = editObj.contact;

    stdUpdateBtn.classList.remove('d-none')
    stdSubmitBtn.classList.add('d-none')

}

const onStdDelete = (ele) => {
    // cl(ele.closest('tr').id, "Deleted")

    let confirmDelete = confirm('Are you sure, you want to delete this Student Info?')

    if (confirmDelete) {
        let deleteId = ele.closest('tr').id;
        cl(deleteId)
        stdArray = stdArray.filter(std => std.stdId != deleteId)
        localStorage.setItem('stdData', JSON.stringify(stdArray))
        document.getElementById(deleteId).remove()

        if (stdArray.length) {
            noStdData.innerHTML = `Number of Students are ${stdArray.length}`
        } else {
            localStorage.removeItem('stdData')
            noStdData.innerHTML = 'No Student Record Found Yet !!!'
            stdTable.classList.add('d-none')
        }


    } else {
        return
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

}


const onStdAdd = (eve) => {
    eve.preventDefault();

    let stdObj = {
        fname: fnameControl.value,
        lname: lnameControl.value,
        email: emailControl.value,
        contact: contactControl.value,
        stdId: create_UUID()
    }

    stdArray.unshift(stdObj)
    trtemplating(stdArray)
    noStdData.innerHTML = `Number of Students are ${stdArray.length}`
    eve.target.reset()
    stdTable.classList.remove('d-none')
    // noStdData.classList.add('d-none') 

    localStorage.setItem('stdData', JSON.stringify(stdArray))

    Swal.fire({
        icon: 'success',
        title: 'Student Info Added Successfully',
        timer: 3000
    })

}

const onStdInfoUpdate = () => {
    let updateId = localStorage.getItem('editId')
    cl(updateId)

    let updatedObj = {
        fname: fnameControl.value,
        lname: lnameControl.value,
        email: emailControl.value,
        contact: contactControl.value
    }
    cl(updatedObj)


    for (let i = 0; i < stdArray.length; i++) {
        if (stdArray[i].stdId === updateId) {
            stdArray[i].fname = updatedObj.fname;
            stdArray[i].lname = updatedObj.lname;
            stdArray[i].email = updatedObj.email;
            stdArray[i].contact = updatedObj.contact;

            break;
        }
    }

    localStorage.setItem('stdData', JSON.stringify(stdArray));

    // trtemplating(stdArray)

    let tr = [...document.getElementById(updateId).children];

    tr[1].innerHTML = updatedObj.fname; // represents fname td
    tr[2].innerHTML = updatedObj.lname; // represents lname td
    tr[3].innerHTML = updatedObj.email; // // represents email td
    tr[4].innerHTML = updatedObj.contact; //// represents fname contact
    cl(tr)

    stdForm.reset()
    stdUpdateBtn.classList.add('d-none')
    stdSubmitBtn.classList.remove('d-none')

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })

}

stdForm.addEventListener('submit', onStdAdd)
stdUpdateBtn.addEventListener('click', onStdInfoUpdate)