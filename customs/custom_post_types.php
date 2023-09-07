<?php 

function create_csv_map_post_type() {
    register_post_type('csv-map', array(
        'labels' => array(
            'name' => 'CSV Maps',
            'singular_name' => 'CSV Map',
        ),
        'public' => false, // Set to false to make it not public
        'show_ui' => true,
        'menu_icon' => 'dashicons-share',
        'supports' => array('title', 'editor'),
        // order of the post type in the admin menu
        'menu_position' => 20,
    ));
    
}
add_action('init', 'create_csv_map_post_type');
