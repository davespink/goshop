function getVersion() {
  return ("GoShop v1.0");
}

function gid(id) {
  return document.getElementById(id);
}
function hid(el) {
  el.style.display = 'none';
}
function vid(el) {
  el.style.display = 'initial';
}
function tvid(el) {
  if (el.style.display == 'initial')
    hid(el)
  else vid(el);
}
function viz(el) {
  if (el.style.display == 'initial')
    return true; else return false;
}
function isa(el, c) {
  if (el == undefined || el == null || el == document)
    return false;
  if (el.classList.contains(c))
    return true; else return false;
}

function isDebug() {
  return false;
}

const Utils = {
  doDebug(s) {
    if (isDebug())
      console.log(s);
  }
}


const Alert = {
  show(message) {
    alertText.innerHTML = "<h3>" + message + "</h3>";
    alertBox.classList.add("animate");
  },

}

const User = {
  name: "anon",
  description: "typical user",
  language: "en",
  get() {
    let l = location.href;
    let a = l.split("?");
    if (a.length > 1) {
      a = a[1].split("=");
      let u = a[1];
      return u;
    }
    else
      return (localStorage.getItem('in_user'));
  },
  set(user) {
    localStorage.setItem('in_user', user);
  },
  dir() {
    return this.get();
  },
  photoDir() {
    return this.dir() + "/photos"
  },
  go() {
    let user = prompt("go user");
    if (!user) {
      alert('no user');
      return;
    }
    this.set(user);
    loadDataFromDisk();
    showAlert("Welcome " + user);
    gid("idUser").innerHTML = "<H1>" + user + "</H1>";

  },
};
//
//    Item - the data stored on each item or container
//
const Item = {
  // belongs in UI
  create(type) {
    let newItem = Object.create(gItemArray[0]);

    pName = prompt('Enter item name', 'unNamed');
    if (pName == null) return false;

    let stampx = new Date().getTime();
    let stamp = stampx.toString();

    newItem.id = stamp;
    newItem.type = type;

    //  newItem.parentId = getCurrentParentId();

    newItem.name = pName;
    newItem.description = pName + " description";
    newItem.image = "./images/noimage.jpg";

    gItemArray.push(newItem);
    return newItem;
  },
  getChildren(id) {
    let children = [];
    for (let i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].parentId == id) {
        children.push(gItemArray[i].id);
        thisItemObject = gItemArray[i].id; // debug
      }
    }
    return children;
  },
  hasChildren(id) {
    return this.getChildren(id).length;
  },
  countChildren(id) {
    return this.getChildren(id).length;
  },
  getById(id) {
    return gItemArray[this.getIndexById(id)];
  },
  getIndexById(id) {
    for (i = 0; i < gItemArray.length; i++) {
      //     
      if (gItemArray[i].id == id) {
        return i;
      }
    }
  },
}

const UI = {
  showAllItems() {


    let bs = document.getElementsByClassName("hasFocus");
    let theFocus = bs[0];

    let el = document.getElementById("divItems");
    el.innerHTML = "";

    function showItem(thisItemObject) {
      Button.createItem(thisItemObject);
    }

    let showArray = gItemArray;

    //   showArray.sort(compareAlpha);

    showArray.forEach(item => {
      Button.createItem(item);
    })

    // restore focus
    if (theFocus)
      gid(theFocus.id).classList.add("hasFocus");


  },


  clearAllFocii() {

    let bs = document.getElementsByClassName("hasFocus");
    for (let i = 0; i < bs.length; i++) {
      bs[i].classList.remove("hasFocus");
    }

  },
}

const Button = {
  click(id) {
    let b = gid(id);
    b.click();
  },
  idToItem(buttonId) {
    let a = buttonId.split("_");
    return a[1];
  },
  selectById(id) {
    let thisButton = gid("item_" + id);
    if (!thisButton)
      thisButton = gid("chain_" + id);
    return thisButton;
  },

  createSearch(itemObject) {

    let newButton = document.createElement('button');
    document.getElementById("divSearchResults").appendChild(newButton);

    // el.addEventListener("touchstart", touchStart);
    //  el.addEventListener("touchend", touchEnd);

    if (itemObject.type == 'c')
      buttonColor = `btn btn-primary`;
    else
      buttonColor = `btn btn-success`;

    buttonId = "search_" + itemObject.id;

    theHTML = `<button id="${buttonId}" 
        onClick="searchButtonClick('${itemObject.id}')" 
         class="${buttonColor}" style="margin:5px">${itemObject.name}</button>`;

    newButton.outerHTML = theHTML;

    return newButton;
  },

  createItem(itemObject) {
    let newButton = document.createElement('button');
    let el = document.getElementById("divItems");
    el.appendChild(newButton);

    // let Up = "\u21e7";
    // let Down = "\u21e9";

    let buttonColor = `btn btn-success`;

    let buttonId = "item_" + itemObject.id;
    let badgeLeftId = "badgeLeft_" + itemObject.id;
    let badgeRightId = "badgeRight_" + itemObject.id;
    let theHTML = `<button id="${buttonId}" onClick=buttonSelected("${buttonId}") 
           class="${buttonColor} bc-button" >${itemObject.name} <span   class="badge bg-dark inBadge" style="float:left">${itemObject.inStock}</span>
           <span class="badge bg-primary inBadge" style="float:right">${itemObject.toBuy}</span>
           </button>`;

    newButton.outerHTML = theHTML;


    return buttonId;

  },

  itemUp() {

    let buttonId = getFocusButtonId();
    let id = Button.idToItem(buttonId);

    let idx = Item.getIndexById(id);
    if (!idx) return;
    let thisItemIndex = gItemArray[idx];

    gItemArray[idx] = gItemArray[idx - 1];
    gItemArray[idx - 1] = thisItemIndex;

    UI.showAllItems();
    clearAllFocii();
    gid(buttonId).classList.add('hasFocus');

  },

  itemDown() {

    let buttonId = getFocusButtonId();
    let id = Button.idToItem(buttonId);

    let idx = Item.getIndexById(id);

    if (idx + 1 == gItemArray.length) return;

    let thisItemIndex = gItemArray[idx];

    gItemArray[idx] = gItemArray[idx + 1];
    gItemArray[idx + 1] = thisItemIndex;

    UI.showAllItems();
    clearAllFocii();
    gid(buttonId).classList.add('hasFocus');

  },

}




/////////////////////////
//
// array operations
//
////////////////////////
function getItemObjectById(id) {
  return Item.getById(id);
}

function getItemObjectIndexById(id) {
  return Item.getIndexById(id);
}
////////////////////////////////



function doSearch() {
  // debugger;

  divSearchResults.innerHTML = '';
  let lookFor = (search.value).toUpperCase();
  if (lookFor.length < 3)
    return;

  for (let i = 0; i < gItemArray.length; i++) {
    let thisName = (gItemArray[i].name).toUpperCase();

    if (thisName.includes(lookFor)) {

      createSearchButton(gItemArray[i]);
    }

  }
}



function clearAllFocii() {
  UI.clearAllFocii();
  return;
  let bs = document.getElementsByClassName("hasFocus");
  for (let i = 0; i < bs.length; i++) {
    bs[i].classList.remove("hasFocus");
  }

}



function clickButton(id) {
  buttonId = "item_" + id;
  b = gid(buttonId);

  b.click();
}




function compareItems(aItem, bItem) {

  aName = aItem.name.toUpperCase();
  bName = bItem.name.toUpperCase();

  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}
function compareAlpha(aItem, bItem) {

  let aName = aItem.name;
  let bName = bItem.name;

  aName = aName.toUpperCase();
  bName = bName.toUpperCase();

  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}

function doDebug(message) {
  // if (message.length == 0) gid("debugWindow").innerHTML = ""; else
  //  gid("debugWindow").innerHTML = gid("debugWindow").innerHTML + message + "</br>";

}

function showAlert(message, type) {
  Alert.show(message);
}

function clearStorage() {
  localStorage.clear();

  showAlert("done clear");
  refreshJSON();
}


const noImage = "./images/noimage.jpg";



// User clicked here
function makeNewItem(type) {
  //debugger;
  thisItemObject = Item.create(type);
  if (!thisItemObject)
    return;

  gItemArray.push(thisItemObject);

  return thisItemObject;
  // find last breadcrumb

  //paintBreadCrumbs(thisItemObject.parentId);

  // Button.click("item_" + thisItemObject.id);
}


function handleClick() {
  alert();
  let thisButton = event.currentTarget;
  buttonSelected(thisButton.id);
}

function createChainButton(itemObject) {
  return Button.createChain(itemObject);
}


function createItemButton(itemObject) {
  return Button.createItem(itemObject);
}





//////  Back End //////////////
const Disk = {
  saveCurrentData() {
    //   debugger;
    const theData = JSON.stringify(gItemArray);

    const xhttp = new XMLHttpRequest();
    var req = "savedatatodisk.php";
    let user = User.get();
    // if (user)
    //  req += "?user=" + user;
    ///alert(user + ' save');
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
      showAlert(this.responseText);
    }
    xhttp.send("data=" + theData);
  },

  loadCurrentData() {

    //debugger;
    const xhttp = new XMLHttpRequest();
    let req = "loaduserdatafromdisk.php";
    let user = User.get();
    //   alert(user);
    // if (user)
    //  req += "?user=" + user;
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {

      gItemArray = JSON.parse(this.responseText);

      UI.showAllItems();

    }
    xhttp.send();
  },


  loadData(file) {

    const xhttp = new XMLHttpRequest();
    let req = "loaddatafromdisk.php";

    //  let file = "testdata.txt";
    //   alert(user);

    req += "?filename=" + file;
    xhttp.open("POST", req);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function () {
      //showAlert(this.responseText);
      gItemArray = JSON.parse(this.responseText);

      UI.showAllItems();
      paintBreadCrumbs(0);
      showAlert("done load test data from disk ", "extra");

      chain_0.click();
    }
    xhttp.send();

  },

  uploadImage() {
    var files = file.files;

    if (files.length > 0) {

      let idValue = getFormValue('inItemId');

      let el = gid("image_" + idValue);


      thePhoto.src = "";

      let theItemObject = getItemObjectById(idValue);

      var formData = new FormData();
      //let theDir = userDir();

      formData.append("file", files[0]); // this passes the filename to PHP

      // make up name of file

      var xhttp = new XMLHttpRequest();

      // produces a file with name same as object id + filetype
      //let req = "./uploadincitio.php?stamp=" + idValue;


      //  $('input[type="file"]').val(null);


      let dir = User.dir();

      if (dir.length > 0)
        dir = "users/" + dir + "/";
      else dir = "";

      stamp = idValue;

      // produces a file with name same as object id + filetype
      let req = "./uploadincitio.php?dir=" + dir + "&stamp=" + idValue;

      xhttp.open("POST", req, true);

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

          var response = this.responseText;
          if (response == 1) {
            alert("File not uploaded. ");
          } else {
            thePhoto.src = response;
            theItemObject.image = response;

            UI.showAllItems();
            var delayInMilliseconds = 100; // 0.1 seconds

            setTimeout(function () {
              //xxx.click();
              thePhoto.src = forceImageLoad(thePhoto.src);
              theHoverPhoto.src = thePhoto.src;

              // https://stackoverflow.com/questions/9155136/chrome-file-upload-bug-on-change-event-wont-be-executed-twice-with-the-same-fi

              file.value = null;

            }, delayInMilliseconds); // to force a refresh .. hopefully
          }
        }
      };
      // Send request with data
      xhttp.send(formData);
    } else {
      showAlert("Please select a file");
    }


  },


  downloadData() {

    let js = JSON.stringify(gItemArray);

    var data = new Blob([js]);
    var a = document.getElementById('a'); // <-- this is defined near the download button
    a.href = URL.createObjectURL(data);

    a.click();

    showAlert("Downloaded " + a.download);



  },


}


function saveDataToDisk() {

  alert("no save");
  // Disk.saveData();
}

//function loadUserDataFromDisk() {
//  Disk.loadUserData();
//}

// FILE UPLOAD STUFF
function uploadImageFile() {

  Disk.uploadImage();
}

function buttonSelected(id) {
  clearAllFocii();
  let el = gid(id);
  el.classList.add("hasFocus");

  let itemId = Button.idToItem(id);
  let thisItem = Item.getById(itemId);

  itemName.value = thisItem.name;
  inStock.value = thisItem.inStock;
  itemName.value = thisItem.name;
  toBuy.value = thisItem.toBuy;
}


function createUser() {

  let newUser = User.get();

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "createuser.php");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onload = function () {
    let resp = this.responseText;
    let a = resp.split("_"); // a[0] should be 0
    if (a[0] != "0") {
      alert("failed to create user - " + a[1]);
    }
    else
      loadTestData();
    //  saveDataToDisk();
  }
  xhttp.send("user=" + newUser);
}

// Disk operations to load or save data
function downloadData() {
  Disk.downloadData();
}

// This will be replaced when the use id code is working
function loadTestData() {

  // now comes from disk

  Disk.loadData("testdata.txt");

  UI.showAllItems();

  chain_0.click();

  showAlert("loaded test data");
}



function DoNewItem() {
  it = Item.create("I");
  Button.createItem(it);
  UI.showAllItems();
}

function getFocusButtonId() {
  let bs = document.getElementsByClassName("hasFocus");
  let el = bs[0];
  if (!el) { alert("choose item"); return; }
  return el.id;
}

function DoDeleteButton() {
  let itBe;
  if (itBe = getFocusButtonId()) {
    gItemArray.splice(Item.getIndexById(itBe), 1);
    UI.showAllItems();
  }
}



function DoUpdateButton() {
  let bs = document.getElementsByClassName("hasFocus");
  let el = bs[0];
  if (!el) { alert("choose item"); return; }
  let id = Button.idToItem(el.id);
  //el.remove();
  let theIndex = Item.getIndexById(id);

  gItemArray[theIndex].name = itemName.value;
  gItemArray[theIndex].inStock = inStock.value;
  gItemArray[theIndex].toBuy = toBuy.value;

  UI.showAllItems();

  gid(el.id).classList.add("hasFocus");
}


