document.addEventListener("DOMContentLoaded", () => {

  function renderRamenDetail(ramen) {
    const detail = document.querySelector("div#ramen-detail")
      detail.querySelector("img").src = ramen.image
      detail.querySelector("h2.name").innerHTML = ramen.name
      detail.querySelector("h3.restaurant").innerHTML = ramen.restaurant
      document.querySelector("span#rating-display").innerHTML = ramen.rating
      document.querySelector("p#comment-display").innerHTML = ramen.comment

      // If the user clicks the update button, update the ramen rating and comment
      document.querySelector('form#edit-ramen').addEventListener('submit', (event) => {
        event.preventDefault();
        let newRating = document.querySelector("input#new-rating");
        let newComment = document.querySelector("textarea#new-comment");
        ramen.rating = newRating.value;
        ramen.comment = newComment.value;
        updateRamen(ramen);
      })

  }
  
  function updateRamen(ramenObj){
    fetch(`http://localhost:3000/ramens/${ramenObj.id}`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      body: JSON.stringify(ramenObj),
    })
    .then(response => response.json())
    .then(ramen => {console.log(ramen); renderRamenDetail(ramen)})

  }

  function renderOneRamen(ramen) {

    // Get the parent node whose child is a button which is a ramen photo
    const ramenMenu = document.querySelector('div#ramen-menu')

    // Make a button, clicking which, we get the detail of the ramen
    const btn = document.createElement('button')
    btn.classList.add("ramen-btn")
    btn.id = ramen.id
    ramenMenu.appendChild(btn)

    // Put the photo of the ramen
    const photo = document.createElement('img')
    photo.src = ramen.image
    photo.className = "ramen-photo"
    btn.appendChild(photo)

    // If the user clicks the photo of a ramen, show the detail of the ramen
    btn.querySelector('.ramen-photo').addEventListener('click', () => {
      renderRamenDetail(ramen)
    })

    document.querySelector('form#delete-ramen').addEventListener('submit', () => {
      btn.remove()
      deleteRamen(ramen.id)
    })

  }

  function deleteRamen(id){
    fetch(`http://localhost:3000/ramens/${id}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
    .then(res => res.json())
  }

  function submitData(nameInput, restaurantInput,
                      imageInput, ratingInput, commentInput) {

    const formData = {
        "name": nameInput,
        "restaurant": restaurantInput,
        "image": imageInput,
        "rating": ratingInput,
        "comment": commentInput,
      };
      
    const configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      };
    
    fetch('http://localhost:3000/ramens', configurationObject)
      .then((response) => response.json())
      .then((data) => renderOneRamen(data))
      .catch(function (error) {
        alert("401!!!");
        const errorMsg = document.querySelector('div#ramen-menu')
        const h2 = document.createElement('h2');
        h2.innerHTML = "Unauthorized Access";
        errorMsg.appendChild(h2);
      });
  }

  // Add new ramen
  const newRamen = document.querySelector("form#new-ramen")
  newRamen.addEventListener('submit', function(event) {
    event.preventDefault();
    let nameInput = document.querySelector("input#new-name");
    let restaurantInput = document.querySelector("input#new-restaurant");
    let imageInput = document.querySelector("input#new-image");
    let ratingInput = document.querySelector("input#new-rating");
    let commentInput = document.querySelector("textarea#new-comment");

    submitData(nameInput.value, restaurantInput.value,
              imageInput.value, ratingInput.value, commentInput.value);

  });

  // Get data and render them to the DOM
  function getAllRamens() {
    fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(ramens => {
      renderRamenDetail(ramens[0])
      ramens.forEach(ramen => renderOneRamen(ramen))
    })
    .catch(function (error) {
      alert("401!");
      const ramenMenu = document.querySelector('div#ramen-menu')
      const h2 = document.createElement('h2');
      h2.innerHTML = "Unauthorized Access";
      ramenMenu.appendChild(h2);
      
    });
    
  }
  getAllRamens()

});
