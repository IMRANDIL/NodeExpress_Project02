const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInp');
const browseBtn = document.querySelector('.browseBtn');
const bgProgress = document.querySelector('.bg-progress');
const percentProgress = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector('#copyBtn');
const fileUrl = document.querySelector('#fileUrl');
const emailForm = document.querySelector('#emailForm');
const host = 'https://innshare.herokuapp.com/';
const uploadUrl = `${host}api/files`;
const emailUrl = `${host}api/files/send`;
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
});

copyBtn.addEventListener('click', () => {
    fileUrl.select();
    document.execCommand('copy')
});

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = fileUrl.value;

    const formData = {
        uuid: url.split('/').splice(-1, 1)[0],
        emailTo: emailForm.elements['To-email'].value,
        emailFrom: emailForm.elements['from-email'].value
    }
    console.table(formData)
    emailForm[2].setAttribute('disabled', 'true')
    fetch(emailUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then((result) => {

        result.json();
    }).then(({ success }) => {
        if (success) {
            sharingContainer.style.display = 'none';
        }
    })

})

const uploadFile = () => {
    progressContainer.style.display = 'block'
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('myfile', file)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            showLink(JSON.parse(xhr.response))
        }
    }
    xhr.upload.onprogress = updateProgress;

    xhr.open('POST', uploadUrl);
    xhr.send(formData)
}


const updateProgress = (e) => {
    const progress = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${progress}%`
    percentProgress.innerText = progress;
    progressBar.style.transform = `scaleX(${progress / 100})`
    // if (progress === 100) {
    //     bgProgress.style.width = '0%';
    //     percentProgress.innerText = '0';
    //     progressBar.style.transform = `scaleX(0)`
    // }
}


const showLink = ({ file }) => {
    fileUrl.value = '';
    emailForm[2].removeAttribute('disabled')
    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block'
    fileUrl.value = file;
}