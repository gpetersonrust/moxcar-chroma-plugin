<?php

function current_post_content_shortcode() {
    // Get the current post's content
    $content = get_the_content();

    // Return the content
    return $content;
}
add_shortcode('current_post_content', 'current_post_content_shortcode');