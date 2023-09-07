// Import the PapaParse library
const Papa = require('papaparse');

// Export a class named JSONConverter
export default class JSONConverter {
  constructor() {
    // Initialize class properties and DOM element references
    this.convertButton = document.getElementById("convertButton");
    this.mapsToSelect = document.querySelectorAll(".select_csv_map");
    this.mapToUseData = null;
    this.postTypeForm = document.getElementById("post-type-form");
    this.cancelPostButton = document.getElementById("cancel-post");
    this.confirmPostButton = document.getElementById("confirm-post");
    this.csvUploadForm = document.getElementById("csv-upload-form");
    this.postTypeSelect = document.getElementById("post-type");
    this.postTypeValue = "post"; // Default post type
    this.originalJsonArray = [];
    this.mappedJsonArray = [];
    this.csvImporterPopupModal = document.getElementById(
      "csv-importer-popup-modal"
    );

    this.csvImporterPopupModalSubmitButton = document.getElementById('csv-importer-popup-modal-submit-btn');
 

    // Initialize event listeners for various elements
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Add event listeners to mapping elements
    this.mapsToSelect.forEach((map) => {
      map.addEventListener("click", () => {
        // Parse and store mapping data
        this.mapToUseData = this.createObjectsFromMappingsDataset(
          JSON.parse(map.parentElement.dataset.pairs)
        );
        // Update keys in the JSON array
        this.mappedJsonArray = this.updateKeys(
          this.originalJsonArray,
          this.mapToUseData
        );
        // Create a table from the mapped JSON data
        this.createTable(this.mappedJsonArray);
      });
    });

    // Add event listener to post type selection
    this.postTypeSelect.addEventListener("change", () => {
      // Update the selected post type value
      this.postTypeValue = this.postTypeSelect.value;
      console.log(this.postTypeValue, "post_type_value");
    });

    // Add event listener to the convert button
    this.convertButton.addEventListener("click", () => {
      // Handle the convert button click
      this.handleConvertButtonClick();
    });

    // Add event listener to the cancel post button
    this.cancelPostButton.addEventListener("click", () => {
      // Hide post type form and show CSV upload form
      this.postTypeForm.style.display = "none";
      this.csvUploadForm.style.display = "block";
    });

    // Add event listener to the confirm post button
    this.confirmPostButton.addEventListener("click", () => {
      // Handle the confirm post button click
      this.handleConfirmPostButtonClick();
    });
  }

  async handleConvertButtonClick() {
    // Retrieve the selected CSV file
    const csvFile = document.getElementById("csvFile").files[0];

    if (csvFile) {
      // Read the CSV file as text
      const csvData = await this.readFileAsText(csvFile);
      // Convert CSV data to JSON
      this.originalJsonArray = this.csvToJson(csvData);
      // Create a table from the original JSON data
      this.createTable(this.originalJsonArray);
      // Show the post type form
      this.postTypeForm.style.display = "block";
    } else {
      // Show an alert if no CSV file is selected
      alert("Please select a CSV file.");
    }
  }

  async handleConfirmPostButtonClick() {
    // Display the CSV importer popup modal
    this.csvImporterPopupModal.style.display = "flex";
    const postTypeElement = document.getElementById("post-type");

    // Add a click event listener to close the modal when clicking outside
    this.csvImporterPopupModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("csv-importer-popup-modal")) {
        this.csvImporterPopupModal.style.display = "none";
        postTypeElement.children[0].selected = true;
      }
    });

    // Add a change event listener to the post type select element
    this.csvImporterPopupModalSubmitButton.addEventListener("click", async () => {
      const postType = postTypeElement.value;
      // Display a confirmation dialog
      const confirmMessage = window.confirm(
        `Are you sure you want to create ${postType} posts?`
      );

      if (confirmMessage) {
        // Hide the post type form
        this.postTypeForm.style.display = "none";
        const { api_url } = moxcar_chroma;
        const buildPosts = api_url + "/build-posts";

        if (!api_url || !this.postTypeValue || !this.mappedJsonArray || !buildPosts) {
          return;
        }

        // Make an HTTP request to create posts
        this.makeRequest(
          buildPosts,
          "POST",
          {
            post_type: this.postTypeValue,
            posts: this.mappedJsonArray,
          },
          this.successHandler,
          this.errorHandler
        );
      } else {
        // Close the modal and reset the post type selection
        this.csvImporterPopupModal.style.display = "none";
        postTypeElement.children[0].selected = true;
      }
    });
  }

  async readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  csvToJson(csvData) {
    // Parse CSV data using PapaParse and return JSON
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data;
  }

  createTable(data) {
    // Create an HTML table from JSON data
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = "";
    const tableContainerDiv = document.createElement("div");
    tableContainerDiv.classList.add("table-container");

    const table = document.createElement("div");
    table.classList.add("table");

    const headerRow = document.createElement("div");
    headerRow.classList.add("header-row");

    for (const key in data[0]) {
      const headerCell = document.createElement("div");
      headerCell.classList.add("cell");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    data.forEach((item) => {
      const row = document.createElement("div");
      row.classList.add("row");

      for (const key in item) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = item[key];
        row.appendChild(cell);
      }
      table.appendChild(row);
    });

    tableContainerDiv.appendChild(table);
    tableContainer.appendChild(tableContainerDiv);
  }

  updateKeys(data, keyMapping) {
    // Update keys in the JSON data based on a key mapping
    return data.map((item) => {
      const updatedItem = {};
      for (const key in item) {
        if (keyMapping.hasOwnProperty(key)) {
          updatedItem[keyMapping[key]] = item[key];
        } else {
          updatedItem[key] = item[key];
        }
      }
      return updatedItem;
    });
  }

  createObjectsFromMappingsDataset(originalJsonArray) {
    // Create an object from a dataset of JSON arrays
    const mergedObject = {};

    originalJsonArray.forEach((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key) && key !== "id") {
          mergedObject[key] = item[key];
        }
      }
    });

    return mergedObject;
  }

  async makeRequest(url, method, body, successCallback, errorCallback) {
    try {
      // Make an HTTP request and handle responses
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": moxcar_chroma.nonce,
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (response.success) {
        if (typeof successCallback === "function") {
          successCallback(responseData);
        }
      } else {
        if (typeof errorCallback === "function") {
          errorCallback(responseData);
        } else {
          throw new Error(responseData.message);
        }
      }
    } catch (error) {
      if (typeof errorCallback === "function") {
        errorCallback(error);
      } else {
        throw new Error(error);
      }
    }
  }

  successHandler(response) {
    // Display a success message and reload the page
    alert("Posts created successfully");
    // window.location.reload();
  }

  errorHandler(error) {
    // Display an error message and reload the page
    alert(error.message || "An error occurred during the request.");
    // window.location.reload();
  }
}
