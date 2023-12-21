const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.set("name", name.value);
    const fileData = files.files[0]
    
    formData.set("files",fileData)
    fetch("/users/uploads", {
        method: 'POST',
        body: formData,
    })
        .then((res) => alert("File Upload Successful"))
        .catch((err) => alert("Error Uploading File"));
}