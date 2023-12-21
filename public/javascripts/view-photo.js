function fetchPhoto(){
    fetch("/users/blobs",{
        method:'GET',
        headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
}).then((response)=> response.json())
    .then((data)=> {
        console.log(data)
        loadPhoto(data)
    })
    .catch((error)=> console.log(error))
}



function loadPhoto(photos){
    
    const photocontainer = document.getElementById("gallery-group")
    console.log(photos.length)
    if(photos.length < 1){
        photocontainer.innerHTML = `<h2>You Don't Have any Photos</h2>`
    }else{
        let imageTag = ""
        for(const photo of photos){
            imageTag += `<img src=${photo.url} alt="gallery photo" height="500" width="500" style="vertical-align:middle;margin:50px;border:5px solid black;border-radius: 15px">`
        }
    
        photocontainer.innerHTML = imageTag
    }

   
}

fetchPhoto()