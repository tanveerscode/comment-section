                                                                                  //1.grabbing  nodes 
const commentWrapper = document.querySelector(".comment-wrapper");
const commentInput = document.querySelector(".comment-input");
const addButton = document.querySelector(".add-button");

const localStorageKey = "state";

const initializeComments = () => {
  const state = localStorage.getItem(localStorageKey);

  if (!state) {
    return [];
  }

  return JSON.parse(state);
};

const comments = initializeComments();

const saveState = () => {
  const state = JSON.stringify(comments);
  localStorage.setItem(localStorageKey, state);
};

                                                        // 4. creating coomment object fuction it will create comment object with id,text,likes,and reply options
const createCommentObject = (commentText) => {
  return {
    id: Math.random(),
    text: commentText,
    likes: 0,
    replies: [],
  };
};

const deleteComment = (comments, commentId) => {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    if (comment.id === commentId) {
      comments.splice(i, 1);
      return;
    }
    deleteComment(comment.replies, commentId);
  }
};
                                                                 // 5. creating commentnode and class //comment structure     
const createCommentNode = (comment) => {
  const commentNode = document.createElement("div");
  commentNode.classList.add("comment", "hide-reply");

  const commentText = document.createElement("div");
  commentText.classList.add("comment-text");
  commentText.innerText = comment.text;

  const buttonsAndLikesWrapper = document.createElement("div");
  buttonsAndLikesWrapper.classList.add("button-and-likes-wrapper");

  const replyButton = document.createElement("button");
  replyButton.classList.add("button", "success");
  replyButton.innerText = "Reply";
  replyButton.onclick = () => commentNode.classList.toggle("hide-reply");

  const likeButton = document.createElement("button");
  likeButton.classList.add("button", "success");
  likeButton.innerText = "Like";
  likeButton.onclick = () => {
    comment.likes++;
    saveState();
    renderComments();
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button", "delete");
  deleteButton.innerText = "Delete";
  deleteButton.onclick = () => {
    deleteComment(comments, comment.id);
    saveState();
    renderComments();
  };

  const likeText = document.createElement("div");
  likeText.innerText = `${comment.likes} Likes`;
  likeText.classList.add("likes-text");
                                                                         //6. structure for reply section---input,add,cancel
  const replyWrapper = document.createElement("div");
  replyWrapper.classList.add("reply-wrapper");

  const replyInput = document.createElement("textarea");
  replyInput.classList.add("reply-input");

  const addReplyButton = document.createElement("button");
  addReplyButton.classList.add("button", "success");

  addReplyButton.innerText = "Add";
  addReplyButton.onclick = () => {
    const replyText = replyInput.value;
    const commentId = comment.id;

    if (replyText === "") {
      alert("Please enter a reply");
      return;
    }
                                                            //7. making an object for   new reply by using createCommentObject and also create an object for replies and push 
    const newReplyObject = createCommentObject(replyText);                  
    comment.replies.unshift(newReplyObject); 
    saveState();
    renderComments();
  };

  const cancelReplyButton = document.createElement("button");
  cancelReplyButton.classList.add("button", "delete");
  cancelReplyButton.innerText = "Cancel";
  cancelReplyButton.onclick = () => commentNode.classList.add("hide-reply");

  const replyCommentsDomArray = comment.replies.map((reply) => {
    return createCommentNode(reply);
  });
// 8.building relation between nodes
  commentNode.appendChild(commentText);
  commentNode.appendChild(buttonsAndLikesWrapper);
  commentNode.appendChild(replyWrapper);

  buttonsAndLikesWrapper.appendChild(replyButton);
  buttonsAndLikesWrapper.appendChild(likeButton);
  buttonsAndLikesWrapper.appendChild(deleteButton);
  buttonsAndLikesWrapper.appendChild(likeText);

  replyWrapper.appendChild(replyInput);
  replyWrapper.appendChild(addReplyButton);
  replyWrapper.appendChild(cancelReplyButton);

  replyCommentsDomArray.forEach((replyDom) => {
    commentNode.appendChild(replyDom);
  });

  return commentNode;
};
                                                                     // 4.for displaying comment on screen in a chain like structure
const renderComments = () => {
  commentWrapper.innerText = "";     // clearing the previous comment.

  comments.forEach((comment) => {
    const commentNode = createCommentNode(comment);

    commentWrapper.appendChild(commentNode);
  });
};
                                                       // 3. add comment function for taking comment input, and creating newcommentObject and pushing into 'comments' array and then render
const addComment = () => {
  const commentText = commentInput.value;

  if (commentText === "") {
    alert("Please enter a comment");
    return;
  }
  const newCommentObject = createCommentObject(commentText);
  // comments.unshift(newCommentObject);
  comments.unshift(newCommentObject);
  saveState();
  commentInput.value = "";
  renderComments();
};
                                                      //2. adding event listener for calling add comment function
addButton.addEventListener("click", addComment);

renderComments();
