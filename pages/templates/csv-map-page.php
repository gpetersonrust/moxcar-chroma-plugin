<div class="wrap">
    <h1>Create and Delete CSV Mappings</h1>

    <section class="admin-buttons">
        <button class="admin-button" type="button" id="create_csv_mapping">Create CSV Mapping</button>
        <button class="admin-button" type="button" id="delete_csv_mapping">Edit CSV Mappings</button>
    </section>

    <section class="create-mapping-keys-container csv-map-item" id="create_mapping_section">
        <form id="csv-upload-form" method="post" enctype="multipart/form-data" action="<?php echo esc_url(admin_url('admin.php?page=csv-importer')); ?>">
            <!-- Your form fields will go here -->
            <input type="file" name="csvFile" id="csvFile" accept=".csv">
            <button class="admin-button" type="submit" id="convertButton">Grab Columns</button>
        </form>

        <h2>Key Mapping</h2>
        <div id="key_mapping_form">
            <div class="key-map-title">
                <input type="text" name="key_map_title" id="key_map_title" value="" placeholder="Title">
            </div>
            <!-- Your form fields will go here -->
            <div id="key_mapping_container">
                <!-- Template form group -->
            </div>
            <button class="admin-button" type="button" id="reset_key_mapping">Reset Key Mapping</button>
            <button class="admin-button" type="button" id="create_key_mapping">Create Key Mapping</button>
        </div>
    </section>

    <section class="delete-mapping-section csv-map-item" id="delete_mapping_section" style="display: none;">
        <h2>Edit CSV Mapping Section</h2>
        <?php
        // Make a query for csv-map post type, loop through and display all csv-maps with edit and delete buttons
        $args = array(
            'post_type' => 'csv-map',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        );
        $csv_maps = get_posts($args);
        if (!$csv_maps) {
            echo '<h3>No CSV Maps Found</h3>';
        } else {
            foreach ($csv_maps as $csv_map) {
                $csv_map_id = $csv_map->ID;
                $csv_map_title = $csv_map->post_title;
                $csv_map_content = $csv_map->post_content;
                ?>
                <div data-pairs="<?php echo esc_attr($csv_map_content); ?>" class="key-map-item">
                    <h3><?php echo esc_html($csv_map_title); ?></h3>
                    <button class="admin-button edit_csv_map" data-csv-map-id="<?php echo esc_attr($csv_map_id); ?>">Edit CSV Map</button>
                    <button class="admin-button delete_csv_map" data-csv-map-id="<?php echo esc_attr($csv_map_id); ?>">Delete CSV Map</button>
                </div>
                <?php
            }
        }
        ?>
    </section>
</div>
