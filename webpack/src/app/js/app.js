import '../scss/app.scss'; // Importing SCSS file


function zoomToTexasAndEast(containerId) {
    var svg = document.getElementById(containerId);

    console.log(svg, 'svg');
    if (svg) {
        var svgWidth = svg.clientWidth;
        var svgHeight = svg.clientHeight;

        // Calculate the new viewBox values to center on Texas and zoom east
        var centerX = -102.5; // Longitude of Texas center
        var centerY = 31.0;   // Latitude of Texas center
        var zoomFactor = 2;   // Zoom factor (adjust as needed)

        var newViewBoxX = centerX - (svgWidth / (2 * zoomFactor));
        var newViewBoxY = centerY - (svgHeight / (2 * zoomFactor));
        var newViewBoxWidth = svgWidth / zoomFactor;
        var newViewBoxHeight = svgHeight / zoomFactor;

        svg.setAttribute("viewBox", `${newViewBoxX} ${newViewBoxY} ${newViewBoxWidth} ${newViewBoxHeight}`);
    }
}

 