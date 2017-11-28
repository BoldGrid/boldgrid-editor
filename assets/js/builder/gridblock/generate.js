window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

			/**
			 * Number of Gridblocks created.
			 *
			 * @since 1.5
			 *
			 * @type {Number}
			 */
			gridblockCount: 0,

			failure: false,

			licenseTypes: [],

			/**
			 * Get a set of Blocks.
			 *
			 * @since 1.5
			 *
			 * @return {$.deferred} Ajax response.
			 */
			fetch: function() {
				if ( self.fetching || self.failure ) {
					return false;
				}

				self.fetching = true;
				self.gridblockLoadingUI.start();

				return self
					.requestGridblocks()
					.done( function( gridblocks, text, xhr ) {
						self.licenseTypes = xhr.getResponseHeader( 'License-Types' ) || '[]';
						self.licenseTypes = JSON.parse( self.licenseTypes );

						self.addToConfig( gridblocks );
						BG.GRIDBLOCK.View.createGridblocks();
					} )
					.always( function() {
						self.fetching = false;
						self.gridblockLoadingUI.finish();
					} )
					.fail( function() {
						self.failure = true;
						BG.GRIDBLOCK.View.$gridblockSection.append(
							wp.template( 'boldgrid-editor-gridblock-error' )()
						);
					} );
			},

			needsUpgrade( $gridblock ) {
				return (
					parseInt( $gridblock.attr( 'data-is-premium' ) ) &&
					parseInt( $gridblock.attr( 'data-requires-premium' ) )
				);
			},

			requestGridblocks: function( options ) {
				var type = BG.GRIDBLOCK.Category.getSearchType();
				options = options || {};

				return $.ajax( {
					url:
						BoldgridEditor.plugin_configs.asset_server +
						BoldgridEditor.plugin_configs.ajax_calls.gridblock_generate,
					dataType: 'json',
					timeout: 10000,
					data: _.defaults( options, {
						/*eslint-disable */
						// If filtered to a type, load 30 otherwise 50.
						quantity: type ? 30 : 50,
						color_palettes: 1,
						include_temporary_resources: 1,
						release_channel: BoldgridEditor.boldgrid_settings.theme_release_channel,
						key: BoldgridEditor.boldgrid_settings.api_key,
						transparent_backgrounds: 'post' === BoldgridEditor.post_type ? 1 : 0,
						type: type,
						color: JSON.stringify({ colors: BG.CONTROLS.Color.getGridblockColors() }),
						category: self.getCategory()
						/*eslint-enable */
					} )
				} );
			},

			/**
			 * Handle showing the loading graphic.
			 *
			 * @since 1.5
			 *
			 * @type {Object}
			 */
			gridblockLoadingUI: {
				start: function() {
					$( 'body' ).addClass( 'loading-remote-body' );
				},
				finish: function() {
					$( 'body' ).removeClass( 'loading-remote-body' );
				}
			},

			/**
			 * Get the users installed category.
			 *
			 * @since 1.5
			 *
			 * @return {string} inspiration catgegory.
			 */
			getCategory: function() {
				var category;
				if (
					BoldgridEditor &&
					BoldgridEditor.inspiration &&
					BoldgridEditor.inspiration.subcategory_key
				) {
					category = BoldgridEditor.inspiration.subcategory_key;
				}

				return category;
			},

			/**
			 * Add a set of Gridblocks to the configuration.
			 *
			 * @since 1.5
			 *
			 * @param {array} gridblocks Collection of Block configs.
			 */
			addToConfig: function( gridblocks ) {
				_.each( gridblocks, function( gridblockData, index ) {
					if ( self.canDisplayGridblock( gridblockData ) ) {
						gridblocks[index] = self.addRequiredProperties( gridblockData );
						BG.GRIDBLOCK.Filter.addGridblockConfig(
							gridblocks[index],
							'generated-' + self.gridblockCount
						);

						self.gridblockCount++;
					}
				} );
			},

			/**
			 * Should we display the gridblock.
			 *
			 * @param  {Object} gridblockData Gridblock data.
			 * @return {boolean}              Whether or not we can display.
			 */
			canDisplayGridblock( gridblockData ) {
				let canDisplayGridblock = true;

				if ( gridblockData.is_premium && ! BoldgridEditor.inspiration_active ) {
					canDisplayGridblock = false;
				}

				return canDisplayGridblock;
			},

			/**
			 * Set the background image for any remote gridblocks..
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $html Gridblock jqury object.
			 */
			updateBackgroundImages: function( $html ) {
				var backgroundImageOverride = $html.attr( 'gb-background-image' );

				if ( backgroundImageOverride ) {
					$html.removeAttr( 'gb-background-image' ).css( 'background-image', backgroundImageOverride );
				}
			},

			/**
			 * Set properties of gridblock configurations.
			 *
			 * @since 1.5
			 *
			 * @param {object} gridblockData A Gridblock config.
			 */
			addRequiredProperties: function( gridblockData ) {
				var $html = $( gridblockData.html );

				self.updateBackgroundImages( $html );
				gridblockData['html-jquery'] = $html;

				return gridblockData;
			}
		};

	BG.GRIDBLOCK.Generate = self;
} )( jQuery );
