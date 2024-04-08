const title = document.getElementById('card-title'),
    image = document.getElementById('card-image'),
    like = document.getElementById('like-button'),
    likeCount = document.getElementById('like-count'),
    comments = document.getElementById('comment'),
    form = document.getElementById('comment-form'),
    commentList = document.getElementById('comments-list');

document.addEventListener('DOMContentLoaded', function () {
    let count = 0;

    const myRequest = new Request('http://localhost:3000/images'),
        commentRequest = new Request('http://localhost:3000/comments');

    // Function to delete a comment
    function deleteComment(commentId) {
        fetch(`http://localhost:3000/comments/${commentId}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the comment element from the DOM
                const commentElement = document.getElementById(commentId);
                if (commentElement) {
                    commentElement.remove();
                }
            })
            .catch(error => console.error('Error deleting comment:', error));
    }

    // Fetching image data
    fetch(myRequest)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Looping through image data
            for (let i = 0; i < data.length; i++) {
                let obj = data[0];
                title.innerHTML = `${obj.title}`;
                image.src = `${obj.image}`;

                // Adding event listener for like button
                like.addEventListener('click', () => {
                    count++;
                    likeCount.innerHTML = `${count} likes`;
                });
            }
        });

    // Fetching comment data
    commentList.innerHTML = "";
    fetch(commentRequest)
        .then((response) => response.json())
        .then((data) => {
            // Looping through comment data
            for (let i = 0; i < data.length; i++) {
                let newComment = data[i];
                const li = document.createElement("li");
                li.id = newComment.id; // Set comment id as the id attribute of the li element
                li.innerHTML = `${newComment.content}`;
                // Add event listener to delete comment when clicked
                li.addEventListener('click', () => {
                    deleteComment(newComment.id);
                });
                commentList.appendChild(li);
            }
        });

    // Adding event listener for form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const postComments = document.getElementById("comment").value;
        console.log(postComments);
        if (postComments == "") {
            alert("Enter a comment");
            return;
        }
        // Commands for adding comment
        fetch(commentRequest, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                imageId: 1,
                content: postComments,
            }),
        });
    });
});