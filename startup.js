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

/*
if (!User.get()) {
  let stampx = new Date().getTime();
  let stamp = stampx.toString();
  User.set("GUEST" + stamp);
  createUser();

} else {
  Disk.loadCurrentData();
}

idUser.innerHTML = "<h6>" + User.get() + "</h6>";

idVersion.innerHTML = getVersion();

alertBox.addEventListener("animationend", () => { alertBox.classList.remove("animate"); });

if (mobile()) {
  let el = gid("panelData");
  el.remove();
  //hid(divDetails); hid(panelIntro);
  topDiv.appendChild(el);
}
*/

window.onbeforeunload = function () {
  Disk.saveCurrentData();
  return null;
}
