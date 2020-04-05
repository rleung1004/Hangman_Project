var firebaseConfig = {
  apiKey: "AIzaSyDtFiyzTNb7eUDLeNHfASR-sZDcljMn8eQ",
  authDomain: "hangman-ee2cd.firebaseapp.com",
  databaseURL: "https://hangman-ee2cd.firebaseio.com",
  projectId: "hangman-ee2cd",
  storageBucket: "hangman-ee2cd.appspot.com",
  messagingSenderId: "508758567676",
  appId: "1:508758567676:web:094859b07a9c8c1bd4c579",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function createRow(name, score, rank) {
  let entry = document.createElement("tr");
  let rankCell = document.createElement("th");
  rankCell.innerHTML = rank;
  entry.appendChild(rankCell);
  let nameCell = document.createElement("td");
  nameCell.innerHTML = name;
  entry.appendChild(nameCell);
  let scoreCell = document.createElement("td");
  scoreCell.innerHTML = score;
  entry.appendChild(scoreCell);

  document.querySelector("#tableBody").appendChild(entry);
}

function gotData(snapshot) {
  let rank = 1;
  let receivedData = [];
  snapshot.forEach(function (childSnapshot) {
    let childData = childSnapshot.val();
    receivedData.push(childData);
  });

  let sortedData = receivedData.reverse();

  sortedData.forEach((data) => {
    createRow(data.name, data.score, rank);
    rank++;
  });
}

function errData(err) {
  console.log("Error");
  console.log(err);
}

function main() {
  let ref = database.ref().orderByChild("score");
  ref.once("value", gotData, errData);
}

main();
