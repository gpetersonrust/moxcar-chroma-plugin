import Papa from 'papaparse';

export class KeyMappingManager {
  constructor() {
    this.createCsvMappingButton = document.getElementById('create_csv_mapping');
    this.deleteCsvMappingButton = document.getElementById('delete_csv_mapping');
    this.createMappingSection = document.getElementById('create_mapping_section');
    this.deleteMappingSection = document.getElementById('delete_mapping_section');
    this.keyMappingForm = document.getElementById('key_mapping_form');
    this.keyMappingContainer = document.getElementById('key_mapping_container');
    this.addKeyMappingButtons = document.querySelectorAll('.add_key_mapping');
    this.deleteKeyMappingButtons = document.querySelectorAll('.delete_key_mapping');
    this.resetKeyMappingButton = document.getElementById('reset_key_mapping');
    
    this.post_key_mapping = document.getElementById('create_key_mapping');
    this.key_map_title = document.getElementById('key_map_title');

    this.keyMappingObjects = [];
   
    this.csv_upload_form = document.getElementById('csv-upload-form');

    this.initializeEventListeners();
  }



  initializeEventListeners() {
    this.createCsvMappingButton.addEventListener('click', () => {
      this.createMappingSection.style.display = 'block';
      this.deleteMappingSection.style.display = 'none';
    });

    this.deleteCsvMappingButton.addEventListener('click', () => {
      this.createMappingSection.style.display = 'none';
      this.deleteMappingSection.style.display = 'block';
    });

    this.addKeyMappingButtons.forEach(button => {
      button.addEventListener('click', this.keyMappingUpdate.bind(this));
    });

    this.deleteKeyMappingButtons.forEach(button => {
      button.addEventListener('click', this.deleteKeyMapping.bind(this));
    });

    this.resetKeyMappingButton.addEventListener('click', () => {
      this.keyMappingContainer.innerHTML = '';
      this.keyMappingObjects = [];
      let newKeyMappingGroup = this.keyMappingGroupTemplate.cloneNode(true);
      newKeyMappingGroup.querySelector('.map-key').value = '';
      newKeyMappingGroup.querySelector('.map-value').value = '';
      this.keyMappingContainer.appendChild(newKeyMappingGroup);
      let time = new Date().getTime();
      let newId = `key-mapping-group-${time}-${this.keyMappingObjects.length}`;
      newKeyMappingGroup.id = newId;
      let newAddKeyMappingButton = newKeyMappingGroup.querySelector('.add_key_mapping');
      let newDeleteKeyMappingButton = newKeyMappingGroup.querySelector('.delete_key_mapping');
      newAddKeyMappingButton.addEventListener('click', this.keyMappingUpdate.bind(this));
      newDeleteKeyMappingButton.addEventListener('click', this.deleteKeyMapping.bind(this));
    });


    this.post_key_mapping.addEventListener('click', async () => {
      const { api_url, nonce } = moxcar_chroma;
      let create_mappings = api_url + '/create-mapping';
      let title = this.key_map_title.value;
      if (!api_url || !nonce || !this.keyMappingObjects || !this.keyMappingObjects.length || !create_mappings || !title) {
        alert("Please enter a title and key mapping");
        return;
      }
      let json_text = JSON.stringify(this.keyMappingObjects);
      let body = {
        map: json_text,
        title,
      };
      try {
        let data = await fetch(create_mappings, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": nonce,
          },
          body: JSON.stringify(body),
        });

        let response = await data.json();

        // if resposne is success
        if (response.success) {
          alert('Key Mapping Created');
        } else {
          alert('Something went wrong check your error log');
          throw new Error(response);
        }

      }
      catch (error) {
        alert('Something went wrong check your error log');
        throw new Error(error);
      }


    })

    this.csv_upload_form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // make innerHTML of key mapping container empty
      this.keyMappingContainer.innerHTML = '';
      let csvFile = this.csv_upload_form.children[0].files[0];
      let csvData = await this.readFileAsText(csvFile);
      let json = this.csvToJson(csvData);
    
      //  get keys from first row
      let keys = Object.keys(json[0]);
      let column_headers = keys.map((key, index) => ({
        id : key.toLocaleLowerCase() +  '-' +  index, 
        key,
        value: key.toLocaleLowerCase().trim().replaceAll(' ', '_'), 
      }));  
       

 
      column_headers.forEach(column => this.createMapColumnEditor(column.id, column.key, column.value));

 

     });
    
  }

  keyMappingUpdate(e) {
    let button = e.target;
    let mode = button.dataset.mode;
    let parent = button.parentElement;
    let key = parent.querySelector('.map-key').value;
    let value = parent.querySelector('.map-value').value;
    let keyMapObject = {};
    let id = parent.id;
    let keyMappingGroup = document.getElementById(id);

    if (!id?.trim() || !key?.trim() || !value?.trim()) {
      return alert('Please enter a key and value');
    }

    keyMapObject[key] = value.toLowerCase();
    keyMapObject['id'] = id;
    this.keyMappingObjects.push(keyMapObject);

    let newKeyMappingGroup = this.keyMappingGroupTemplate.cloneNode(true);
    newKeyMappingGroup.querySelector('.map-key').value = '';
    newKeyMappingGroup.querySelector('.map-value').value = '';
    this.keyMappingContainer.appendChild(newKeyMappingGroup);
    let time = new Date().getTime();
    let newId = `key-mapping-group-${time}-${this.keyMappingObjects.length}`;
    newKeyMappingGroup.id = newId;
    let newAddKeyMappingButton = newKeyMappingGroup.querySelector('.add_key_mapping');
    let newDeleteKeyMappingButton = newKeyMappingGroup.querySelector('.delete_key_mapping');
    newAddKeyMappingButton.addEventListener('click', this.keyMappingUpdate.bind(this));
    newDeleteKeyMappingButton.addEventListener('click', this.deleteKeyMapping.bind(this));
  }

  deleteKeyMapping(e) {
    let button = e.target;
    let parent = button.parentElement;
    let id = parent.id;

    if (!this.keyMappingObjects.some(keyMapObject => keyMapObject.id === id)) {
      return;
    }

    let keyMappingGroup = document.getElementById(id);
    keyMappingGroup.remove();

    this.keyMappingObjects = this.keyMappingObjects.filter(keyMapObject => {
      return keyMapObject.id !== id;
    });
  }


  createMapColumnEditor(id, key, value){
 
    let mapColumnEditor = document.createElement('div');
    id  = id || 'key-mapping-group-1';
    key = key || 'Key';
    value = value || 'Value';

    /**
     * //   <div  id="key-mapping-group-1" class="key-mapping-group">
                    <input type="text" name="key" class="map-key" value="" placeholder="Key">
                    <input type="text" name="value" class="map-value" value="" placeholder="Value">
                    <button  data-mode="add" class="admin-button add_key_mapping">Add Key Mapping</button>
                    <button class="admin-button delete_key_mapping">Delete Key Mapping</button>
                </div>
     */
    mapColumnEditor.id =  id;
    mapColumnEditor.classList.add('key-mapping-group');
    mapColumnEditor.innerHTML = `
    <input type="text" readonly name="key" class="map-key" value="${key}" >
    <input type="text" name="value" class="map-value" value="${value}" >
     
    `;

    this.keyMappingObjects.push({
      [key]: value,
      id,
    });


    // get map value and update key mapping object on every keyup
    mapColumnEditor.querySelector('.map-value').addEventListener('keyup', (e) => {
   
      let value = e.target.value;
      let key = e.target.previousElementSibling.value;
      let id = e.target.parentElement.id;
       
      this.keyMappingObjects = this.keyMappingObjects.map(keyMapObject => {
        if (keyMapObject.id == id) {
          keyMapObject[key] =   value;
        }
        return keyMapObject;
      });
     
    });


     
  this.keyMappingContainer.appendChild(mapColumnEditor);

  }

   readFileAsText(file) {
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
  
}
