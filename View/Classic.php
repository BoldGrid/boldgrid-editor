<?php
/**
 * File: Classic.php
 *
 * Classic Editor Page View.
 *
 * @since      1.9.0
 * @package    Boldgrid
 * @subpackage Boldgrid\PPB\View\Classic
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */
namespace Boldgrid\PPB\View;

/**
 * Class: Classic
 *
 * Classic Editor Page View.
 *
 * @since      1.9.0
 */
class Classic {

	/**
	 * Add new page.
	 *
	 * @since 1.9.0
	 */
	public function init() {
		add_action( 'admin_enqueue_scripts', function () {
			wp_enqueue_script(
				'bgppb-classic',
				\Boldgrid_Editor_Assets::get_webpack_script( 'classic' ),
				array( 'jquery', 'underscore' ),
				BOLDGRID_EDITOR_VERSION,
				true );

			wp_localize_script(
				'bgppb-classic',
				'BoldgridEditor = BoldgridEditor || {}; BoldgridEditor',
				[
					'global_settings' => \Boldgrid_Editor_Service::get( 'settings' )->get_all(),
				]
			);

			if ( ! \Boldgrid_Editor_Assets::is_webpack() ) {
				wp_enqueue_style( 'bgppb-settings',
					plugins_url( '/assets/dist/settings.min.css', BOLDGRID_EDITOR_ENTRY ),
					array(), BOLDGRID_EDITOR_VERSION );
			}
		} );
	}
}
