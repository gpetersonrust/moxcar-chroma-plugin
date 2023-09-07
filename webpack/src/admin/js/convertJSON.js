import makeRequest from '../../../library/utilities/requests/make_requests';

const Papa = require('papaparse');
export default class JSONConverter {
  constructor() {
    this.convertButton = document.getElementById("convertButton");
    this.mapsToSelect = document.querySelectorAll(".select_csv_map");
    this.mapToUseData = null;
    this.postTypeForm = document.getElementById("post-type-form");
    this.cancelPostButton = document.getElementById("cancel-post");
    this.confirmPostButton = document.getElementById("confirm-post");
    this.csvUploadForm = document.getElementById("csv-upload-form");
    this.postTypeSelect = document.getElementById("post-type");
    this.postTypeValue = "post";
    this.originalJsonArray = [];
    this.mappedJsonArray = [];
    this.csvImporterPopupModal = document.getElementById(
      "csv-importer-popup-modal"
    );
    this.makeRequest = makeRequest;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.mapsToSelect.forEach((map) => {
      map.addEventListener("click", () => {
        this.mapToUseData = this.createObjectsFromMappingsDataset(
          JSON.parse(map.parentElement.dataset.pairs)
        );
        this.mappedJsonArray = this.updateKeys(
          this.originalJsonArray,
          this.mapToUseData
        );
        this.createTable(this.mappedJsonArray);
      });
    });

    this.postTypeSelect.addEventListener("change", () => {
      this.postTypeValue = this.postTypeSelect.value;
      console.log(this.postTypeValue, "post_type_value");
    });

    this.convertButton.addEventListener("click", () => {
      this.handleConvertButtonClick();
    });

    this.cancelPostButton.addEventListener("click", () => {
      this.postTypeForm.style.display = "none";
      this.csvUploadForm.style.display = "block";
    });

    this.confirmPostButton.addEventListener("click", () => {
      this.handleConfirmPostButtonClick();
    });
  }

  async handleConvertButtonClick() {
    const csvFile = document.getElementById("csvFile").files[0];

    if (csvFile) {
      const csvData = await this.readFileAsText(csvFile);
      this.originalJsonArray = this.csvToJson(csvData);
      this.createTable(this.originalJsonArray);
      this.postTypeForm.style.display = "block";
    } else {
      alert("Please select a CSV file.");
    }
  }

  async handleConfirmPostButtonClick() {
    this.csvImporterPopupModal.style.display = "flex";
    const postTypeElement = document.getElementById("post-type");
    this.csvImporterPopupModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("csv-importer-popup-modal")) {
        this.csvImporterPopupModal.style.display = "none";
        postTypeElement.children[0].selected = true;
      }
    });

    postTypeElement.addEventListener("change", async () => {
      const postType = postTypeElement.value;
      const confirmMessage = window.confirm(
        `Are you sure you want to create ${postType} posts?`
      );

      if (confirmMessage) {
        this.postTypeForm.style.display = "none";
        const { api_url } = moxcar_chroma;
        const buildPosts = api_url + "/build-posts";

        if (!api_url || !this.postTypeValue || !this.mappedJsonArray || !buildPosts) {
          return;
        }

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
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    return results.data;
  }

  createTable(data) {
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
    alert("Posts created successfully");
    window.location.reload();
  }

  errorHandler(error) {
    alert(error.message || "An error occurred during the request.");
    window.location.reload();
  }
}

 

