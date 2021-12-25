const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInp');
const browseBtn = document.querySelector('.browseBtn');
const host = 'https://innshare.herokuapp.com/';
const uploadUrl = `${host}api/files`;
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged')
    }


});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged')
})


dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        uploadFile()
    }

})


browseBtn.addEventListener('click', () => {
    fileInput.click()
})

fileInput.addEventListener('change', () => {
    uploadFile()
})

const uploadFile = () => {
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('myfile', file)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
        }
    }
    xhr.upload.onprogress = updateProgress;

    xhr.open('POST', uploadUrl);
    xhr.send(formData)
}


const updateProgress = (e) => {
    const progress = Math.round((e.loaded / e.total) * 100);
    console.log(progress);
}