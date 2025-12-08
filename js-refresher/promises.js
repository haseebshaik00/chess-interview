// Callback
const posts = [
    {title: "Post 1", body: "Body 1"},
    {title: "Post 2", body: "Body 2"},
];

const getPost = () => {
    let output = '';
    setTimeout(()=>{
        posts.forEach((post) => {
            output +=  `<li> ${post.title} </li>`;
        })
        document.querySelector("#p-tag").innerHTML = output;
    }, 1000);
}

const createPost = (post) => {
    return new Promise((resolve, reject) => {
        try{
            setTimeout(()=>{
                posts.push(post);
                resolve();
            }, 2000);
        }
        catch{
            reject("something went wrong!");
        }
    })
}

createPost({title: 'Post 3', body: 'Body 3'})
    .then(getPost)
    .catch(err => console.log(err));