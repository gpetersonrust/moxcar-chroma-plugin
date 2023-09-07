export function deleteMapKey() {
  // Select all elements with the class "edit_csv_map"
  const editButtons = document.querySelectorAll(".edit_csv_map");

  // Attach click event listener to each "Edit CSV Map" button
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const csvMapId = button.getAttribute("data-csv-map-id");
      // You can perform any action you want when the button is clicked
      // For example, redirect to an edit page or show a modal
      console.log("Editing CSV Map with ID:", csvMapId);
    });
  });

  // Select all elements with the class "delete_csv_map"
  const deleteButtons = document.querySelectorAll(".delete_csv_map");

  // Attach click event listener to each "Delete CSV Map" button
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const csvMapId = button.getAttribute("data-csv-map-id");
      if(!csvMapId) {
        return alert('No CSV Map ID found')
      }

      // confirmation dialog
      const confirmDelete = confirm('Are you sure you want to delete this CSV Map?');
      if(!confirmDelete) {
        return;
      }
      try {
        const { api_url, nonce } = moxcar_chroma;
        let delete_mappings = api_url + '/delete-mapping';
        let data = {  id: csvMapId };
        const response = await fetch(delete_mappings, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce,
          },
        });
        const json = await response.json();
        if(json.success) {
          alert('CSV Map Deleted');
          window.location.reload();
         
        } else {
          alert('Something went wrong check your error log');
          throw new Error(json);

        }

        
      } catch (error) {
        alert('Something went wrong check your error log');
        throw new Error(error);
      }
      
     
    });
  });
}
