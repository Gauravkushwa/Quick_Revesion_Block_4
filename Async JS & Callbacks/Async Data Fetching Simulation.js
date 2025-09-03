function fetchUserData(callback) {
    console.log("Fetching user data...");
  
    setTimeout(() => {
      callback("User data received");
    }, 1000); 
  }
  function fetchUserPosts(callback) {
    console.log("Fetching user posts...");
  
    setTimeout(() => {
      callback("User posts received");
    }, 1500); 
  }
  
  fetchUserData((userMessage) => {
    console.log(userMessage);
  
    fetchUserPosts((postMessage) => {
      console.log(postMessage);
  
      console.log("All data loaded successfully!");
    });
  });
  