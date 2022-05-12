//init

const url = `https://arpit-todo.herokuapp.com/posts`;
renderdata();
checkfunc();
// add task
const maincontainer = document.querySelector(`.maincontainer`);
const addbtn = document.querySelector(`.newbtn`);
const newtaskpop = document.querySelector(`.newnewtask`);
const cancelbtn = document.querySelector(`.canceltaskbtn`);
const taskinput = document.querySelector(`.insertnew`);
const addtaskbtn = document.querySelector(`.addtaskbtn`);
const noTaskErrorPopup=document.querySelector('.no_task_update')

let arraycheck = [];

addbtn.addEventListener(`click`, function () {
  newtaskpop.classList.remove(`hidden`);
  noTaskErrorPopup.textContent = ``;
  taskinput.value="";
});

cancelbtn.addEventListener(`click`, function () {
  newtaskpop.classList.add(`hidden`);
  noTaskErrorPopup.textContent = ``;
  errorfunc()
});


async function checkfunc() {
  let res = await fetch(url);
  let data = await res.json();

  data?.forEach(function (elem) {
    arraycheck.push(elem.task);
  })
}

async function sub() {
  let value = taskinput.value;
  let value01 = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().trim();

  if (!value01) {
    noTaskErrorPopup.innerText = `Please Enter Task`
  } else {
    if (arraycheck.includes(value01)) {
      noTaskErrorPopup.innerText = `Task Already Exist`
    } else {
      let res = await fetch(url, {
        method: `POST`,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: value01,
          status: false,
        }),
      })
      if (res.ok) {
        renderdata();
        location.reload();
      }

      newtaskpop.classList.add(`hidden`);
      
    }
  }
}

addtaskbtn.addEventListener(`click`, sub)

// ENter submit

document.querySelector('.insertnew').addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sub();
  }
})


async function renderdata() {
  let html = "";
  try {
    let res = await fetch(url);
    let data = await res.json();
    data?.forEach((elem, i) => {
      if (elem.status) {
        html += `<div class="eventcontainer done">
        <div class="event">
          <p class="sno line">${i + 1}</p>
          <p class="task line">${elem.task}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="funcdone(${elem.id})">Unchecked</button>
          <button class="updatebtn update hidden">Edit</button>
          <button class="updatebtn delete" onclick="deletetask(${elem.id})">Delete</button>
        </div>
      </div>`
      } else {
        html += `
        <div class="eventcontainer">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${elem.task}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="funcdone(${elem.id})">Checked</button>
          <button class="updatebtn update" onclick="updatepop(${elem.id})">Edit</button>
          <button class="updatebtn delete" onclick="deletetask(${elem.id})">Delete</button>
        </div>
      </div>`;
      }
    });
  }
  catch {
    noTaskErrorPopup.innerText = `Error Fetching Data Please Check the Server`;
  }

  maincontainer.innerHTML = html;
  errorfunc();

}

function errorfunc() {
  if (!maincontainer.innerHTML) {
    noTaskErrorPopup.innerText = `No Tasks Exist`;
  }
}
// delete task 

async function deletetask(id) {
  await fetch(`https://arpit-todo.herokuapp.com/posts/${id}`, {
    method: `DELETE`,
  });
  await renderdata();
  location.reload();
}

// checked and UnChecked.........
async function funcdone(id) {
  let res = await fetch(`${url}/${id}`);
  let data = await res.json();

  if (data.status) {
    await fetch(`https://arpit-todo.herokuapp.com/posts/${id}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: data.task,
        date: data.date,
        status: false,
      }),
    });
  } else {
    await fetch(`https://arpit-todo.herokuapp.com/posts/${id}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: data.task,
        date: data.date,
        status: true,
      }),
    });
  }

  renderdata();
}

//edit task

const updatetaskpop = document.querySelector(`.updatetaskbox`);
const updcancel = document.querySelector(`.updcanceltaskbtn`);
const updbtn = document.querySelector(`.updtaskbtn`);
const insertupd = document.querySelector(`.insertupd`)
let idnum;

async function updatepop(id) {
  updatetaskpop.classList.remove(`hidden`);
  idnum = id;
};

updcancel.addEventListener(`click`, function () {
  updatetaskpop.classList.add(`hidden`);
  noTaskErrorPopup.textContent = ``;
})


async function upd() {
  let value = insertupd.value;
  let newvalue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().trim();

  if (arraycheck.includes(newvalue)) {
    noTaskErrorPopup.innerHTML = `Task Already Exist`;
  } else {
    let res = await fetch(url);
    let data = await res.json();

    await fetch(`https://arpit-todo.herokuapp.com/posts/${idnum}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: value,
        status: data.status,
      }),
    })

    if (res.ok) {
      renderdata();
    }
    updatetaskpop.classList.add(`hidden`);
    location.reload();
  }
}

updbtn.addEventListener(`click`, upd)

// addtaskbtn.addEventListener(`click`, updatepop)

// ENter submit

document.querySelector('.insertupd').addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    upd()
  }
})

//search task

const search = document.querySelector(`.search`);

search.addEventListener(`keyup`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";

  await data.forEach(async function (elem, i) {

    const searchval = search.value;
    const searchvalue_01 =
      searchval.charAt(0).toUpperCase() + searchval.slice(1).toLowerCase().trim();

    noTaskErrorPopup.innerHTML = ``;

    if (elem.task.includes(searchvalue_01)) {
      console.log(elem);
      let data = await elem;
      if (data.status) {
        html += `<div class="eventcontainer done">
        <div class="event">
          <p class="sno line">${i + 1}</p>
          <p class="task line">${data.task}</p>
        </div>
    
        <div class="btnsupdate">
          <button class="updatebtn finished">Finished</button>
          <button class="updatebtn update hidden">Edit</button>
          <button class="updatebtn delete" onclick="deletetask(${data.id})">Delete</button>
        </div>
      </div>`
      } else {
        html += `
        <div class="eventcontainer">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>
    
        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="funcdone(${data.id})">Finished</button>
          <button class="updatebtn update" onclick="updatepop(${data.id})">Edit</button>
          <button class="updatebtn delete" onclick="deletetask(${data.id})">Delete</button>
        </div>
      </div>`;
      }

    }

    maincontainer.innerHTML = html;


  });

  if (!maincontainer.innerHTML) {
    noTaskErrorPopup.innerText = `No Search Found`;
  }
});


const alltasks = document.querySelector(`.Alltasks`);

alltasks.addEventListener(`click`, async function () {
  await renderdata();
  if (!maincontainer.innerHTML) {
    errortext.innerText = `No Tasks Exist`;
  }
})

// incompleted Tasks

const incompleted = document.querySelector(`.incomplete`);

incompleted.addEventListener(`click`, async function () {
  let html = ``;
  let res = await fetch(url);
  let data = await res.json();

  data?.forEach(async function (elem, i) {
    if (!elem.status) {
      html += `<div class="eventcontainer">
      <div class="event">
        <p class="sno">${i + 1}</p>
        <p class="task">${elem.task}</p>
      </div>
  
      <div class="btnsupdate">
        <button class="updatebtn finished" onclick="funcdone(${elem.id})">Finished</button>
        <button class="updatebtn update" onclick="updatepop(${elem.id})">Edit</button>
        <button class="updatebtn delete" onclick="deletetask(${elem.id})">Delete</button>
      </div>
    </div>`;
    }
  })

  maincontainer.innerHTML = html;
})


//completed

const completed = document.querySelector(`.completed`);

completed.addEventListener(`click`, async function () {
  let html = ``;
  let res = await fetch(url);
  let data = await res.json();

  data?.forEach(async function (elem, i) {
    if (elem.status) {
      html += `<div class="eventcontainer done">
        <div class="event">
          <p class="sno line">${i + 1}</p>
          <p class="task line">${elem.task}</p>
        </div>
    
        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="funcdone(${elem.id})">Finished</button>
          <button class="updatebtn update hidden" onclick="updatepop(${elem.id})">Edit</button>
          <button class="updatebtn delete" onclick="deletetask(${elem.id})">Delete</button>
        </div>
      </div>`;
    }
  })

  maincontainer.innerHTML = html;
})


