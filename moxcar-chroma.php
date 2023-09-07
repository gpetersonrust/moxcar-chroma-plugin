<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://gpeterson@moxcar.com
 * @since             1.0.0
 * @package           Moxcar_Chroma
 *
 * @wordpress-plugin
 * Plugin Name:       Moxcar Chroma
 * Plugin URI:        https://gpeterson@moxcar.com
 * Description:       This is a description of the plugin.
 * Version:           1.0.0
 * Author:            Gino Peterson
 * Author URI:        https://gpeterson@moxcar.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       moxcar-chroma
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}



 define('MOXCAR_CHROMA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MOXCAR_CHROMA_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once MOXCAR_CHROMA_PLUGIN_DIR . 'shortcodes/shortcodes.php';
require_once MOXCAR_CHROMA_PLUGIN_DIR . 'pages/add_menu.php';
require_once MOXCAR_CHROMA_PLUGIN_DIR . '/api/api.php';
require_once MOXCAR_CHROMA_PLUGIN_DIR . '/customs/custom_post_types.php';
require_once MOXCAR_CHROMA_PLUGIN_DIR . '/utils/utils.php';
/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'MOXCAR_CHROMA_VERSION', '1.0.0' );





/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-moxcar-chroma-activator.php
 */
function activate_moxcar_chroma() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-moxcar-chroma-activator.php';
	Moxcar_Chroma_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-moxcar-chroma-deactivator.php
 */
function deactivate_moxcar_chroma() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-moxcar-chroma-deactivator.php';
	Moxcar_Chroma_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_moxcar_chroma' );
register_deactivation_hook( __FILE__, 'deactivate_moxcar_chroma' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-moxcar-chroma.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_moxcar_chroma() {

	$plugin = new Moxcar_Chroma();
	$plugin->run();

}
run_moxcar_chroma();
