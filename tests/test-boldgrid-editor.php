<?php
/**
 * BoldGrid Source Code
 *
 * @package Test_Boldgrid_Editor
 * @copyright BoldGrid.com
 * @version $Id$
 * @since 1.0.3
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

/**
 * BoldGrid Editor Plugin Test class
 */
class Test_Boldgrid_Editor extends WP_UnitTestCase {

	/**
	 * Class property $testClass
	 */
	protected $testClass;

	/**
	 * Class property $settings
	 */
	protected $settings = array (
		'configDir' => 'includes/config'
	);

	/**
	 * Setup the test env
	 */
	public function setUp() {

		$this->testClass = new Boldgrid_Editor( $this->settings );

	}

	/**
	 *  Override of empty tags allowed as an array
	 *  @since 1.0.3
	 */
	public function test_allow_empty_tags() {

		$allow_empty_tags = $this->testClass->allow_empty_tags( array() );
		$this->assertEquals( 'div[*],i[*]', $allow_empty_tags['extended_valid_elements'] );

	}

	/**
	 *  Testing getting merge of configs
	 *  @since 1.0.3
	 */
	public function test_get_api_configs() {

 		$api_configs = $this->testClass->get_api_configs();
 		$this->assertEquals( false, $api_configs['api_configs']['connection_successful'] );
 		$this->assertEquals( '/api/asset/get', $api_configs['api_configs']['ajax_calls']['get_api_asset'] );

	}

	/**
	 *  Testing check to see if this is a BG theme
	 *  @since 1.0.3
	 */
	public function test_is_boldgrid_theme_non_bg() {

		$is_boldgrid_theme = Boldgrid_Editor::is_editing_boldgrid_theme();
 		$this->assertEquals( false, $is_boldgrid_theme );

	}

	/**
	 *  Testing get name of theme on non BG theme
	 *  @since 1.0.3
	 */
	public function test_get_boldgrid_theme_name_non_bg ( ) {

		$get_boldgrid_theme = Boldgrid_Editor::get_boldgrid_theme_name( wp_get_theme() );
		$this->assertEquals( '', $get_boldgrid_theme );

	}

	/**
	 *  Testing the retrieval of post id through global request var's
	 *  @since 1.0.3
	 */
	public function test_get_post_url_post_not_found() {

		$get_post_url = $this->testClass->get_post_url();
		$this->assertEquals( get_site_url(), $get_post_url );

	}

	/**
	 *  Testing the body class that will be added to the editor
	 *  @since 1.0.3
	 */
	public function test_theme_body_class_default(){

		$theme_body_class = $this->testClass->theme_body_class();
		$this->assertEquals( 'palette-primary', $theme_body_class );

	}

}

