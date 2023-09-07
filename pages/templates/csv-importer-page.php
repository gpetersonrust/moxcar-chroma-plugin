<?php 
 
 $post_types = get_allowed_post_types(); 

 echo "<script>
 var allowed_post_types = ".json_encode(get_allowed_post_types())."
 console.log(allowed_post_types);
</script>";

?>

<div class="wrap">

<div id="csv-importer-popup-modal" class="csv-importer-popup-modal" style="display:none;">
    <div class="content">
    <h4>Choose your Post Type: </h4>
    <select name="post-type" id="post-type">
        <option id="select-post-type" value="">Select A Post Type</option>
        <?php foreach($post_types as $key => $value): ?>
            <option value="<?php echo $key ?>"><?php echo   $value ?></option>
        <?php endforeach; ?>
    </select>
    <!-- confirm button -->
      
    </div>
   
    
</div>

    <h1>CSV Importer</h1>
    <form id='csv-upload-form'  method="post" enctype="multipart/form-data" action="<?php echo get_site_url()  . '/wp-admin/admin.php?page=csv-importer'  ?>">
        <!-- Your form fields will go here -->
       
     
        <input type="file" name="csvFile" id="csvFile" accept=".csv">
        <button class="admin-button" type="button" id="convertButton">Convert to JSON</button>
  
          
    </form>

    <!-- i neeed a form with options of post type that can be entered with a submit and cancel button -->
    <form id='post-type-form'  method="post" enctype="multipart/form-data"  style="display: none;">
      

        <button class="admin-button" type="button" id="cancel-post" role="">Cancel Posts</button>
        <button class="admin-button" type="button" id="confirm-post" role="button">Upload Posts</button>
    </form>

   <?php
      
       // make query for csv-map post type loop through and display all csv-maps with edit and delete buttons
       $args = array(
           'post_type' => 'csv-map',
           'post_status' => 'publish',
           'posts_per_page' => -1,
       );
       $csv_maps = get_posts($args);
       if(!$csv_maps){
           echo '<h3>No CSV Maps Found</h3>';
       } else {
       foreach ($csv_maps as $csv_map) {
           $csv_map_id = $csv_map->ID;
           $csv_map_title = $csv_map->post_title;
           $csv_map_content = $csv_map->post_content;
        //    https://chroma.local/wp-admin/post.php?post=190&action=edit
        $edit_post_link = get_edit_post_link($csv_map_id);
           ?>
           <div    data-pairs='<?php echo  $csv_map_content; ?>'  class="key-map-item">
               <h3><?php echo $csv_map_title; ?></h3>
                
               <a  target="_blank" href="<?php echo     $edit_post_link ?>" class="admin-button edit_csv_map" data-csv-map-id="<?php echo $csv_map_id; ?>">View CSV Map</a>
               <button class="admin-button select_csv_map" data-csv-map-id="<?php echo $csv_map_id; ?>">Select CSV Map</button>
           </div>
           <?php
       } 
   } ?>
     
</div>


<!-- table -->
<div class="my-section">
    <div class="json-data-table" id="tableContainer"></div>
</div>
 

