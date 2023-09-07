<?php 

define('CSV_IMPORTER_MENU_TITLE', 'CSV Importer');
define('CSV_IMPORTER_MENU_SLUG', 'csv-importer');
define('CSV_MAP_MENU_TITLE', 'CSV Map');
define('CSV_MAP_MENU_SLUG', 'csv-map');


// Menu registration
function csv_importer_add_menu() {
    add_menu_page(
        CSV_IMPORTER_MENU_TITLE,
        CSV_IMPORTER_MENU_TITLE,
        'manage_options',
        CSV_IMPORTER_MENU_SLUG,
        'csv_importer_page'
    );

    // Save csv_map page
    add_submenu_page(
        CSV_IMPORTER_MENU_SLUG,
        CSV_MAP_MENU_TITLE,
        CSV_MAP_MENU_TITLE,
        'manage_options',
        CSV_MAP_MENU_SLUG,
        'csv_map_page'
    );
}
add_action('admin_menu', 'csv_importer_add_menu');

// Include page templates
function csv_importer_page() {
    include MOXCAR_CHROMA_PLUGIN_DIR . 'pages/templates/csv-importer-page.php';
}

function csv_map_page() {
    include MOXCAR_CHROMA_PLUGIN_DIR . 'pages/templates/csv-map-page.php';
}
