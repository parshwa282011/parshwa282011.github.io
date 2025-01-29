document.getElementById('proxyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
  
    const urlInput = document.getElementById('urlInput').value;
    const responseText = document.getElementById('responseText');
    
    // Validate URL input
    if (!urlInput) {
      responseText.textContent = "Please enter a valid URL.";
      return;
    }
  
    // Show a loading message
    responseText.textContent = "Loading...";
  
    // Send the request to the proxy server
    fetch(`/proxy/${urlInput}`)
      .then((response) => response.text())
      .then((data) => {
        // Display the response from the proxy
        responseText.textContent = data;
      })
      .catch((error) => {
        // Handle errors if the request fails
        responseText.textContent = `Error: ${error.message}`;
      });
  });
  