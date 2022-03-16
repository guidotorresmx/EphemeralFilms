const db = firebase.firestore();
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('#search')
  const secData = document.querySelector('.filmesSelected')
  const form = document.querySelector('form')
  const select = document.getElementsByClassName('select')
  const filmList = document.getElementById('filmeList')

  // filmList.addEventListener('click', )

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
    console.log("searchValue", searchValue)

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

            removeElement()
            // document.querySelector('.uncheck').innerHTML = ""
            list.forEach((item) => {
              let id = item.id;
              if (id.slice(0, 2) === 'tt') {
                const name = item.l;

                const poster = item.i.imageUrl


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
  console.log("selected", selected)
  
  // selected.classList.toggle('uncheck')
  if(element.getAttribute('class') === 'delet'){
    element.innerHTML = "SELECT";
    element.removeAttribute('class', 'delet')
    element.setAttribute('class', 'choose')

    let getid = selected.getAttribute('id')
    console.log('esse eh o getid', getid)
    db.collection('Users').doc(`${getid}`).delete()
  }else{
  const colocar = document.querySelector('.filmesSelected')
  

  element.innerText = "Delete"
  element.setAttribute('class', "delet")
 
  db.collection('Users').add({
    movie: selected.innerHTML,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    

  }).then(function (doc) {
    console.log('Document written with id:', doc.id);
    selected.setAttribute("id", doc.id)
    selected = '';



  }).catch(function (err) {
    console.log(error, err)
  })
}
    showMovies()  
}

function showMovies(){
  db.collection("Users")
    .orderBy("timestamp")
    .onSnapshot(
      (querySnapshot) => {
        let output = '';
        const secData = document.querySelector('.filmesSelected')

        querySnapshot.forEach((doc) => {
          console.log("doc.data do forEach", doc.data())
          output += `<li id='${doc.id}' >${doc.data().movie}</li>`;
          console.log("doc.id", doc.id)
        });
        //DISPLAY MOVIE LIST
        secData.innerHTML = output;
      },
      (error) => {
        console.log(error)
      }

    );
    }


showMovies()
