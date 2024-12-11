const itemObject = {
  id: "0",
  type: "c",
  name: "root",
  description: "the root",
  image: "?"
};

 

let gItemArray = [];
gItemArray.push(itemObject);



Alert.show("it starts here");



// fake some data


Button.createItem(itemObject);

 
//debugger;

  
if (!User.get()) {
  let stampx = new Date().getTime();
  let stamp = stampx.toString();
  User.set("GUEST" + stamp);
  createUser();

} else {
  Disk.loadCurrentData();
}

 

alertBox.addEventListener("animationend", () => { alertBox.classList.remove("animate"); });

 
 

window.onbeforeunload = function () {
  Disk.saveCurrentData();
  return null;
}
