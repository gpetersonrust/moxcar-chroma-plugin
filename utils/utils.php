<?php 

function  get_allowed_post_types(){
    // $get_post_types = get_post_types();
    // get all post types including custom post types
    $get_post_types = get_post_types( array( 'public' => true ) );
    return $get_post_types;
}

