
function Items(name, price, type, qty) {
  this.name = name;
  this.price = price;
  this.type = type;
  this.qty = qty;
}

sessionStorage.clear();

let ItemsList = [
  {
    Name: "Panner Butter Masal",
    Price: 270,
    Type: "curry",
    Quantity: 1,
  },
  {
    Name: "Malai Koftha",
    Price: 250,
    Type: "curry",
    Quantity: 1,
  },
  {
    Name: "Rasmalai",
    Price: 120,
    Type: "dessert",
    Quantity: 1,
  },
  {
    Name: "Ice Cream",
    Price: 180,
    Type: "dessert",
    Quantity: 1,
  },
  {
    Name: "Manchuria",
    Price: 240,
    Type: "starters",
    Quantity: 1,
  },
  {
    Name: "Baby Corn",
    Price: 260,
    Type: "starters",
    Quantity: 1,
  },
  {
    Name: "Butter Naan",
    Price: 60,
    Type: "breads",
    Quantity: 1,
  },
  {
    Name: "Cheese Burger",
    Price: 200,
    Type: "burger",
    Quantity: 1,
  },
  {
    Name: "Cold Coffee",
    Price: 100,
    Type: "beverges",
    Quantity: 1,
  },
  {
    Name: "Lemon Soda",
    Price: 100,
    Type: "beverges",
    Quantity: 1,
  },
];

const menuItems = [];
for (let item of ItemsList) {
  menuItems.push(new Items(item.Name, item.Price, item.Type, item.Quantity));
}

let menu = "";
let mId = 1;
for (const item of menuItems) {
  menu =
    menu +
    '<div id ="' +
    mId +
    '" class="card items-drag" draggable="true" ><div class="card-body"><h3 class="card-title">' +
    item.name +
    '</h3><p class="card-text">' +
    item.price +
    "</p><br> </div></div>";
  mId += 1;
}

document.getElementById("items").innerHTML = menu;

function searchItems() {
  let input = document.getElementById("searchItem").value;
  input = input.toLowerCase();
  const cardContainer = document.getElementById("items");
  const cards = cardContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector(".card-body h3.card-title");

    if (
      title.innerHTML.toLowerCase().indexOf(input) > -1 ||
      menuItems[i].type.toLowerCase().indexOf(input) > -1
    ) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function searchTables() {
  let input = document.getElementById("searchTable").value;
  input = input.toLowerCase();
  const cardContainer = document.getElementById("table-names");
  const cards = cardContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector(".card-body h3.card-title");
    if (title.innerHTML.toLowerCase().indexOf(input) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

const itemsDraggable = document.querySelectorAll(".items-drag");
const all_tables = document.querySelectorAll(".drop-table");
let dragabbleItem = null;

itemsDraggable.forEach((item) => {
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragend", dragEnd);
});
function dragStart() {
  dragabbleItem = this;
}
function dragEnd() {
  dragabbleItem = null;
}

all_tables.forEach((table) => {
  table.addEventListener("dragover", dragOver);
  table.addEventListener("dragenter", dragEnter);
  table.addEventListener("dragleave", dragLeave);
  table.addEventListener("drop", dragDrop);
});
function dragOver(e) {
  e.preventDefault();
  this.style.border = "1px solid black";
}
function dragEnter() {
  this.style.border = "1px solid black";
}
function dragLeave() {
  this.style.border = "1px solid black";
}

function dragDrop() {
  const spans = this.getElementsByTagName("span");
  const itemCost = dragabbleItem.getElementsByTagName("p");

  spans[1].innerHTML = Number(spans[1].innerHTML) + 1;
  spans[0].innerHTML =
    Number(spans[0].innerHTML) + Number(itemCost[0].innerHTML);

  var str = this.getElementsByTagName("h3")[0].innerHTML;
  var matches = str.match(/(\d+)/);

  if (sessionStorage[matches[0]]) {
    let result = JSON.parse(sessionStorage.getItem(matches[0]));
    let flag = 1;
    for (let i = 0; i < result.length; i++) {
      let first = result[i][0];
      let quantity = result[i][1];
      if (first == dragabbleItem.id) {
        result[i][1] = quantity += 1;
        flag = 0;
        break;
      }
    }
    if (flag) {
      result.push([dragabbleItem.id, menuItems[dragabbleItem.id].qty]);
    }
    sessionStorage.setItem(matches[0], JSON.stringify(result));
  } else {
    sessionStorage.setItem(
      matches[0],
      JSON.stringify([[dragabbleItem.id, menuItems[dragabbleItem.id].qty]])
    );
  }
}

function openItems(tableId) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  let sNo = "<h5>S.No</h5>",
    itemName = "<h5>Item</h5>",
    itemPrice = "<h5>Price</h5>";
  let servings = "<h5>Number of servings</h5>";
  let deleteIcon = "<h5>Delete</h5>";
  var totalbill = 0;
  if (result.length == 0) {
    document.querySelectorAll(".drop-table").forEach(x => x.style.backgroundColor = "white");
    document.querySelector(".pop-up").style.display = "none";
    return;
  }
  for (let i = 0; i < result.length; i++) {
    let first = result[i][0];
    let quantity = result[i][1];
    let itemId = Number(first);
    let val = i + 1;
    totalbill += menuItems[itemId - 1].price * quantity;
    sNo += "<p>" + val + "</p>";
    itemName += "<p>" + menuItems[itemId - 1].name + "</p>";
    itemPrice += "<p>" + menuItems[itemId - 1].price + "</p>";
    servings +=
      "<input  type='number' name='" +
      tableId +
      "' value='" +
      quantity +
      "' size='1' min='0'onchange='increment(this," +
      itemId +
      "," +
      tableId +
      "," +
      i +
      ")' /> ";
    deleteIcon +=
      "<p onclick='deleteItem(this, " +
      i +
      ", " +
      tableId +
      "," +
      quantity +
      "," +
      menuItems[itemId - 1].price +
      ")'  ><i class='fas fa-trash' ></i></p>";
  }
  let closeSession =
    "<button onclick='generateBill(" +
    tableId +
    ")' class='btn btn-danger'>Generate Bill</button>";

  document.getElementById("sno").innerHTML = sNo;
  document.getElementById("item-name").innerHTML = itemName;
  document.getElementById("item-price").innerHTML = itemPrice;
  document.getElementById("servings").innerHTML = servings;
  document.getElementById("total-bill").innerHTML = totalbill;
  document.getElementById("delete-icon").innerHTML = deleteIcon;
  document.getElementById("close-session").innerHTML = closeSession;
  document.querySelector(".pop-up").style.display = "flex";
  document.getElementById("total-bill").style.display = "";
}

function openPopUp(id) {
  var str = id.getElementsByTagName("h3")[0].innerHTML;
  var matches = str.match(/(\d+)/);
  openItems(matches[0]);
  id.style.backgroundColor = "orange";
}
function closePopUp(id) {
  document.querySelectorAll(".drop-table").forEach(x => x.style.backgroundColor = "white");
  document.querySelector(".pop-up").style.display = "none";
}

function deleteItem(id, index, tableId, qty, price) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  result.splice(index, 1);
  sessionStorage.setItem(tableId, JSON.stringify(result));
  billId = "tableBill-" + tableId;
  const tableName = document.getElementById(billId);
  const spans = tableName.getElementsByTagName("span");
  spans[1].innerHTML = Number(spans[1].innerHTML) - 1;
  spans[0].innerHTML = Number(spans[0].innerHTML) - qty * price;

  openItems(tableId);
}

function increment(id, itemId,tableId, index) {
  let serves = id.value;
  let result = JSON.parse(sessionStorage.getItem(id.name));
  result[index][1] = serves;
  sessionStorage.setItem(id.name, JSON.stringify(result));
  result = JSON.parse(sessionStorage.getItem(id.name));

  var totalbill = 0;
  for (let i = 0; i < result.length; i++) {
    first = result[i][0];
    quantity = result[i][1];
    itemId = Number(first);
    totalbill += menuItems[itemId - 1].price * quantity;
  }

  document.getElementById("total-bill").innerHTML = totalbill;
  let result1 = JSON.parse(sessionStorage.getItem(tableId));
  result1.splice(index, 1);
  sessionStorage.setItem(tableId, JSON.stringify(result));
  billId = "tableBill-" + tableId;
  const tableName = document.getElementById(billId);
  const spans = tableName.getElementsByTagName("span");
  spans[1].innerHTML = quantity;
  spans[0].innerHTML = totalbill;

}

function generateBill(tableId) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  let sNo = "<h5>S.No</h5>",
    itemName = "<h5>Item</h5>",
    itemPrice = "<h5>Price</h5>";
  let servings = "<h5>Number of servings</h5>";
  var totalbill = 0;
  for (let i = 0; i < result.length; i++) {
    let first = result[i][0];
    let quantity = result[i][1];
    let itemId = Number(first);
    let val = i + 1;
    totalbill += menuItems[itemId - 1].price * quantity;
    sNo += "<p>" + val + "</p>";
    itemName += "<p>" + menuItems[itemId - 1].name + "</p>";
    itemPrice += "<p>" + menuItems[itemId - 1].price + "</p>";
    servings += "<p>" + quantity + "</p>";
  }
  billId = "tableBill-" + tableId;
  const tableName = document.getElementById(billId);
  const spans = tableName.getElementsByTagName("span");
  spans[1].innerHTML = 0;
  spans[0].innerHTML = 0;
  sessionStorage.removeItem(tableId);
  document.getElementById("sno").innerHTML = sNo;
  document.getElementById("item-name").innerHTML = itemName;
  document.getElementById("item-price").innerHTML = itemPrice;
  document.getElementById("servings").innerHTML = servings;
  document.getElementById("total-bill").innerHTML = totalbill;
  document.getElementById("delete-icon").innerHTML = "";
  document.getElementById("close-session").innerHTML = "";
  document.getElementById("total-bill").style.display = "";
}
