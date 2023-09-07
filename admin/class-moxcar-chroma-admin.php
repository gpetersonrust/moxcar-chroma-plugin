<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://gpeterson@moxcar.com
 * @since      1.0.0
 *
 * @package    Moxcar_Chroma
 * @subpackage Moxcar_Chroma/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Moxcar_Chroma
 * @subpackage Moxcar_Chroma/admin
 * @author     Gino Peterson <gpeterson@moxcar.com>
 */
class Moxcar_Chroma_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Moxcar_Chroma_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Moxcar_Chroma_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		 $app_dist =  MOXCAR_CHROMA_PLUGIN_URL . 'dist/admin/admin' . dynamic_hash() . '.css';

		wp_enqueue_style( $this->plugin_name,  $app_dist, array(), $this->version, 'all' );

 
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Moxcar_Chroma_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Moxcar_Chroma_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		$app_dist =  MOXCAR_CHROMA_PLUGIN_URL . 'dist/admin/admin' . dynamic_hash() . '.js';
		// get current url
		$current_url = get_site_url() . $_SERVER['REQUEST_URI'];
		// app_dist script
		wp_enqueue_script( $this->plugin_name, $app_dist, array(  ), $this->version, true );
		// localize script site_url and wp-json nonce
		wp_localize_script( $this->plugin_name, 'moxcar_chroma', array(
			'api_url' => get_site_url() . '/wp-json/moxcar/v1',
			'nonce' => wp_create_nonce('wp_rest'),
			'current_page_url' => 	$current_url,
			 
		) );

   
	}

}


/**
 * Get the dynamic hash generated for assets.
 *
 * This function retrieves the dynamic hash generated for assets by following these steps:
 * 1. Read the 'dist/app' directory and get the first file.
 * 2. Extract the hash from the file name by splitting it with '-wp'.
 * 3. Further extract the hash by splitting it with '.' to remove the file extension.
 * 4. Combine the hash with the '-wp' prefix and return the final dynamic hash.
 *
 * @since    1.0.0
 *
 * @return   string   The dynamic hash for assets.
 */
 