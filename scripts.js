document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('#search')
  const secData = document.querySelector('.filmesSelected')
  const form = document.querySelector('form')
  const select = document.getElementsByClassName('select');

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    searchMovie()

  })
  function removeElement() {
    const chk = document.querySelectorAll(".uncheck");
    chk.forEach((item) => {
      item.remove()
    })
  }
  // function check(element) {
  //   element.parentElement.classList.toggle('uncheck')
  //   console.log(element)

  // }

  function searchMovie() {
    let searchValue = searchInput.value
    console.log(searchValue)

    fetch(`https://imdb8.p.rapidapi.com/auto-complete?q=${searchValue}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "0097e28d00msh520a86c687471ffp117aa3jsn587bc72f4bd7"
      }
    })
      .then(response => {
        response.json()
          .then(data => {
            const list = data.d
            console.log(list)
            removeElement()
            // document.querySelector('.uncheck').innerHTML = ""
            list.forEach((item) => {
              let id = item.id;
              if (id.slice(0, 2) === 'tt') {
                const name = item.l;
                console.log(name);
                const poster = item.i.imageUrl
                console.log(poster);

                const movie = `<li class="uncheck"><h2>${name}</h2> <img src="${poster}"><button onclick="check(this)" class="choose">Select</button></li>`
                document.querySelector('.movies').innerHTML += movie;
              }
            })

          })
      })
      .catch(err => {
        console.error(err);
      })
  }
})


function check(element) {
  const db = firebase.firestore();

  const selected = element.parentElement;
  console.log(selected)



  selected.classList.toggle('uncheck')
  console.log(element)

  const colocar = document.querySelector('.filmesSelected')
  console.log(colocar)
  element.innerText = "Delete"
  element.setAttribute('class', "delet")
  if (selected.className !== "") {
    db.collection("Users")
      .doc(movie)
      .delete()
      .then(() => console.log("Document successfully deleted"))
      .catch((err) => console.log("Error deleting document", err))
  } else {
    colocar.appendChild(selected)
  }
  db.collection('Users').add({
    movie: selected.innerHTML,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),

  }).then(function (docRef) {
    console.log('Document written with id:', docRef.id);
    console.log(docRef)
    selected = '';


  }).catch(function (err) {
    console.log(error, err)
  })

  db.collection("Users")
    .orderBy("timestamp")
    .onSnapshot(
      (querySnapshot) => {
        let output = '';
        const secData = document.querySelector('.filmesSelected')

        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          output += `<li>${doc.data().movie}</li>`;
        });

        secData.innerHTML = output;
      },
      (error) => {
        console.log(error)
      }

    );
}

function deleteFilm(id) {
  db.collection("Users")
    .doc(id)
    .delete()
    .then(() => console.log("Document successfully deleted"))
    .catch((err) => console.log("Error deleting document", err))
}
const db = firebase.firestore();
db.collection("Users")
  .orderBy("timestamp")
  .onSnapshot(
    (querySnapshot) => {
      let output = '';
      const secData = document.querySelector('.filmesSelected')

      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        output += `<li>${doc.data().movie}</li>`;
      });

      secData.innerHTML = output;
    },
    (error) => {
      console.log(error)
    }

  );