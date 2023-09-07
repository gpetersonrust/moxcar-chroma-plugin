<?php

// custom-api-endpoint.php

add_action('rest_api_init', 'register_custom_api_route');

function register_custom_api_route() {
    register_rest_route('moxcar/v1', '/build-posts', array(
        'methods' => 'POST',
        'callback' => 'build_posts',
    ));

    register_rest_route('moxcar/v1', '/create-mapping', array(
        'methods' => 'POST',
        'callback' => 'create_mapping',
    ));

    register_rest_route('moxcar/v1', '/delete-mapping', array(
        'methods' => 'POST',
        'callback' => 'delete_mapping',
    ));
}



function build_posts($request) {
    $data = json_decode($request->get_body(), true);
    $post_type = sanitize_text_field($data['post_type']);
    $posts = $data['posts'];
 
    foreach ($posts as $post_data) {
        if (empty($post_data['post_title'])) {
            $failed_posts[] = array(
                'post_data' => $post_data,
                'error' => 'Missing post_title',
            );
            continue; // Skip this iteration and move to the next post
        }

        $csv_id =  isset($post_data['csv_id']) ? sanitize_text_field($post_data['csv_id']) : null; // Assuming 'csv_id' is the field you use to match posts


       
         isset($csv_id)  &&   $existing_post = find_post_by_csv_id($post_type, $csv_id);

    
           
        if ($existing_post) {
            $post_type = $existing_post->post_type;
            // Update the existing post
            update_existing_post($existing_post->ID, $post_data, $post_type);
        } else {
            // Create a new post
            $post_id = create_new_post($post_type, $post_data);

            if (!$post_id) {
                $failed_posts[] = array(
                    'post_data' => $post_data,
                    'error' => 'Failed to create post',
                );
            }
        }
    }

    if (!empty($failed_posts)) {
        return array('message' => 'Posts created/updated with some failures.', 'failed_posts' => $failed_posts, 'success' => false, 'status' => 401);
    } else {
        return array('message' => 'All posts created/updated successfully.', 'success' => true, 'status' => 200);
    }
}


function find_post_by_csv_id($post_type, $csv_id) {

 
    // Query posts based on the 'csv_id' field
    $args = array(
        'post_type' =>   $post_type, // Replace with your actual post type
        'meta_key' => 'csv_id', // Replace with the actual custom field name
        'meta_value' => $csv_id,
    );

    $posts = get_posts($args);

    if (!empty($posts)) {
        return $posts[0]; // Return the first matching post
    } else {
        return null; // No matching post found
    }
}

function handle_post_thumbnail($post_id, $post_data) {
    if (!empty($post_data['post_thumbnail'])) {
        $post_thumbnail_url = sanitize_text_field($post_data['post_thumbnail']);
        $post_thumbnail_id = attachment_url_to_postid($post_thumbnail_url);

        if ($post_thumbnail_id) {
            // If a valid attachment ID is found, set it as the post thumbnail
            set_post_thumbnail($post_id, $post_thumbnail_id);
        }
    }
}

function update_meta_values($post_id, $post_data) {
    foreach ($post_data as $meta_key => $meta_value) {
        if ($meta_key !== 'post_title' && $meta_key !== 'post_content' && $meta_key !== 'post_thumbnail') {
            $meta_key = sanitize_text_field($meta_key);
            $meta_value = sanitize_text_field($meta_value);

            update_field($meta_key, $meta_value, $post_id);
        }
    }
}

function update_existing_post($post_id, $post_data, $post_type) {
    $post_title = sanitize_text_field($post_data['post_title']);
    $post_content = wp_kses_post($post_data['post_content']);
   
   
    // Update the post's content
    $post_args = array(
        'ID' => $post_id,
        'post_type' => $post_type,
        'post_title' => $post_title,
        'post_content' => $post_content,
    );

    wp_update_post($post_args);

    // // Update custom fields for the post
    update_meta_values($post_id, $post_data);

    // // Handle post thumbnail updates here if needed
    handle_post_thumbnail($post_id, $post_data);
}

function create_new_post($post_type, $post_data) {
    $post_title = sanitize_text_field($post_data['post_title']);
    $post_content = wp_kses_post($post_data['post_content']);

    // Create a new post
    $post_args = array(
        'post_type' => $post_type,
        'post_title' => $post_title,
        'post_content' => $post_content,
        'post_status' => 'publish',
    );

    $post_id = wp_insert_post($post_args);

    // Handle custom fields for new posts
    update_meta_values($post_id, $post_data);

    // Handle post thumbnail for new posts
    handle_post_thumbnail($post_id, $post_data);

    return $post_id;
}

 


function create_mapping($request){
  
    $nonce = $request->get_header('x-wp-nonce');
    // verify nonce
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
      return   array('message' => 'Invalid nonce', 'success' => false, 'status' => 401);
   
    }  
    $csv_map = $request['map'];
    $title = $request['title'];

    // check if post with title already exists
    $post = get_page_by_title($title, OBJECT, 'csv-map');
    if ($post) {
        return array('message' => 'CSV Map with this title already exists.', 'success' => false, 'status' => 401);
    }
    // sanitize csv map
    $csv_map = sanitize_text_field($csv_map);
    // create post
    $post_args = array(
        'post_type' => 'csv-map',
        'post_title' => $title,
        'post_content' => $csv_map,
        'post_status' => 'publish',
    );
    $post_id = wp_insert_post($post_args);
    if ($post_id) {
        return array('message' => 'CSV Map created successfully.', 'success' => true, 'status' => 200);
    } else {
        return array('message' => 'Failed to create CSV Map', 'success' => false ,'status' => 401);
    }

    
}

function delete_mapping($data){
    $nonce = $data->get_header('x-wp-nonce');
    if(!$nonce){
        return array('message' => 'Invalid nonce', 'success' => false, 'status' => 401);
    }
    $post_id = $data['id'];
    // sanitize post id
    $post_id = sanitize_text_field($post_id);
    $deleted = wp_delete_post($post_id, true);
    if ($deleted) {
        return array('message' => 'CSV Map deleted successfully.', 'success' => true, 'status' => 200);
    } else {
        return array('message' => 'Failed to delete CSV Map', 'success' => false ,'status' => 401);
    }
}

 