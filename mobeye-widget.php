<?php
/*
Plugin Name: MobEye Widget
Plugin URI: http://mobeye.com
Description: To start discover new world with MobEye widget all you need is to create a channel on MobEyeVision.com that is a piece of cake. Send us request to <a href="mailto:support@mobeye.com">support@mobeye.com</a> and follow the instructions. The whole process will only take a couple of minutes, and after that you can start broadcasting.
Version: 2.0.4
Author: MobEye team
Author URI: http://mobeye.com
License: GPL2
*/

/*  Copyright 2013  MobEye team  (email : support@mobeye.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function mew_addbuttons() {
    // Only do this stuff when the current user has permissions and we are in Rich Editor mode
    if ( ( current_user_can('edit_posts') || current_user_can('edit_pages') ) && get_user_option('rich_editing') ) {
        add_filter("mce_external_plugins", "mew_register_plugin");
        add_filter('mce_buttons', 'mew_register_button');
    }
}

function mew_register_button($buttons) {
    array_push($buttons, "separator", "mobeyewidget");
    return $buttons;
}

// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function mew_register_plugin($plugin_array)
{
    $plugin_array['mobeyewidget'] = plugins_url("tinymce-plugin/mobeye.widget.js" ,__FILE__);
    return $plugin_array;
}

// init process for button control
add_action('init', 'mew_addbuttons');

function my_admin_head() {
    ?>

    <script type='text/javascript'>
        var mobeye = {
            'siteUrl': '<?php echo get_site_url() ?>',
            'cmsVersion': '<?php echo "Wordpress ".get_bloginfo('version') ?>',
            'pluginVersion': '<?php echo get_plugin_data(__FILE__)['Version'] ?>'
        };
    </script>
<?php
}

foreach ( array('post.php','post-new.php') as $hook ) {
    add_action( "admin_head-$hook", 'my_admin_head' );
}

?>