const form =  document.getElementById("frm");
const form1 = document.getElementById("frm1");
const txt =   document.getElementById("txt");
const t1 =    document.getElementById("t1");
const fname = document.getElementById("name");
const emsg =  document.getElementById("msg");
const btn =   document.getElementById("btn");
const tmsg =  document.getElementById("tmsg");
const sbtn =  document.getElementById("sbtn");
let data = {};
let state = false;

form1.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!t1.value) return 0;
  getItems(t1.value);
});

fname.addEventListener("keyup", () => {
  try {
    if (!fname.value) {
      btn.disabled = true;
      state = false;
      throw { msg: "FileName is Required" };
    }
    data = {
      name: fname.value,
    };

    fetch("/txt", {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data1) => {
        state = data1.pro;
        if (data1.pro) {
          btn.disabled = false;
          emsg.textContent = " ";
        } else {
          setTimeout(() => {
            emsg.textContent = data1.msg;
            btn.disabled = true;
          }, 200);
        }
      });
  } catch (err) {
    emsg.textContent = err.msg;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  data = {
    name: fname.value,
    text: txt.innerHTML,
    createdOn: `${Date().substring(0,24)}`,
  };
  tmsg.textContent = " ";
  try {
    if (!txt.innerHTML) {
      throw { status: 404, message: "Text is Required" };
    }
    console.log(data);
    fetch("/new", {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((resp) => {
        btn.disabled = true;
        setTimeout(() => {
          getItems(data.name);
        }, 500);
      });
  } catch (err) {
    tmsg.textContent = err.message;
  }
});

function getItems(loc) {
  window.location = window.location.href + loc;
}
