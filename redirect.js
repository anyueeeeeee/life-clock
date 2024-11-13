window.addEventListener('load', function () {
    const isMobile = window.innerWidth <= 768;
    // Check the current page and redirect if necessary
    if (isMobile && !window.location.href.includes('index-mobile.html')) {
        // Redirect to mobile version if the screen is smaller than or equal to 768px
        window.location.href = "index-mobile.html";
    } else if (!isMobile && !window.location.href.includes('index.html')) {
        // Redirect to desktop version if the screen is wider than 768px
        window.location.href = "index.html";
    }
});