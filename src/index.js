let addToy = false;

function createToyCard(toy) {
  const toysContainer = document.querySelector("#toy-collection");
  const toyCard = document.createElement("div");
  toyCard.classList.add("card");
  toyCard.innerHTML = `
  <h2>${toy.name}</h2>
  <img src = "${toy.image}" class = "toy-avatar">
  <p><span>${toy.likes}</span> Like${toy.likes !== 1 ? "s" : ""}</p>
  <button class = "like-btn" id = "${toy.id}">Like &#9829</button>
  `;
  toysContainer.appendChild(toyCard);

  // Add Likes Button event listener
  document.querySelector('.like-btn').addEventListener('click', e => increaseLikes(e.target.id))
}

async function newLikes(toyid) {
  const res = await fetch(`http://localhost:3000/toys/${toyid}`);
  const toy = await res.json();
  let toyLikes = parseInt(toy.likes);
  return ++toyLikes;
}


async function increaseLikes(toyId){
  const newNumberOfLikes = await newLikes(toyId)
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      likes: newNumberOfLikes
    }),
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector('.card p span').textContent = data.likes
  })
}

function addNewToy(newToyObj) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newToyObj),
  })
  .then(res => res.json())
  .then(data => {
    createToyCard(data)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch all toys
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((data) => {
      // Display the toys in cards
      data.forEach((toy) => createToyCard(toy));
    })
    .catch((error) => console.log(error));

  // Add a new toy
  const form = document.querySelector(".add-toy-form");
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewToy({
      name: document.querySelector(".input-text").value,
      image: document.querySelector('input[name = "image"]').value,
      likes: 0
    });
    form.reset();
  });
});
