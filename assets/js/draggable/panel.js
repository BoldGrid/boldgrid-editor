var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Panel = {

		$element : null,
		
		currentControl : null,

		/**
		 * Initialize the panel.
		 *
		 * @since 1.3
		 *
		 * @return jQuery $this.$element Panel Element
		 */
		init : function () {

			this.create();
			this._setupPanelClose();
			this._setupDrag();
			//this._setupPanelResize();
			this._setupCustomizeLeave();
			this._setupCustomizeDefault();

			return this.$element;
		},

		/**
		 * Create Panel HTML.
		 *
		 * @since 1.3
		 */
		create : function () {
			this.$element = $( wp.template( 'boldgrid-editor-panel' )() );
			$( 'body' ).append( this.$element );
		},

		centerPanel : function () {
			var $window = $(window),
			    width = parseInt( this.$element.css('width') ),
			    height = parseInt( this.$element.css('height') ),
			    windowWidth = $window.width(),
			    windowHeight = $window.height(),
			    centerWidth = ( windowWidth / 2 ) - ( width / 2 ),
			    centerHeight = ( windowHeight / 2 ) - ( height / 2 );

			this.$element.css( {
				'top' : centerHeight,
				'left' : centerWidth
			} );
		},

		/**
		 * Setup Scrolling within the panel.
		 *
		 * @since 1.3
		 */
		initScroll : function ( control ) {
			var target = self.getScrollTarget(),
				sizeOffset = -66;
			
			if ( control.panel && control.panel.sizeOffset ) {
				sizeOffset = control.panel.sizeOffset;
			}

			$(".panel-body").slimScroll({destroy: true}).attr('style', '');
			this.$element.find( target ).slimScroll( {
			    color: '#32373c',
			    size: '8px',
			    height: parseInt( control.panel.height ) + sizeOffset,
			    alwaysVisible: true,
			    disableFadeOut: true,
			    wheelStep: 5,
			} );
		},

		/**
		 * Check if a control is currently open.
		 *
		 * @since 1.3
		 */
		isOpenControl : function ( control ) {
			var isOpenControl = false;

			if ( this.$element.is( ':visible' ) && this.$element.attr( 'data-type' ) == control.name ) {
				isOpenControl = true;
			}

			return isOpenControl;
		},

		/**
		 * Initialize dragging of the panel.
		 *
		 * @since 1.3
		 */
		_setupDrag : function() {
			this.$element.draggable( {
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll : false
			} );
		},

		/**
		 * Remove all selected options.
		 *
		 * @since 1.3
		 */
		clearSelected : function () {
			this.$element.find( '.selected' ).removeClass( 'selected' );
		},

		/**
		 * Setup resizing of the panel.
		 *
		 * @since 1.3
		 */
		_setupPanelResize : function() {
			this.$element.resizable();
		},

		/**
		 * Setup resizing of the panel.
		 *
		 * @since 1.3
		 */
		_setupPanelClose : function() {
			this.$element.on( 'click', '.close-icon', function () {
				self.closePanel();
			} );
		},
		
		removeClasses : function () {
			BG.Controls.$container.find( '.bg-control-element' ).removeClass( 'bg-control-element' );
		},

		closePanel : function () {
			self.$element.hide();
			BOLDGRID.EDITOR.Menu.deactivateControl();
			self.removeClasses();
			
			if ( self.$element.hasClass( 'customize-open' ) ) {
				this.$element.trigger('bg-customize-exit');
				self.$element.removeClass('customize-open');
			}
			
			this.$element.find('.panel-body').empty();
			
			this.$element.trigger('bg-panel-close');
			tinymce.activeEditor.undoManager.add();
		},

		scrollToSelected : function () {
			var scrollPos, scrollOffset,
				$selected = self.$element.find( '.selected:not(.filters .selected)' );

			self.scrollTo(0);

			if ( ! $selected.length ) {
				return;
			}
			
			scrollOffset = 0;
			if ( self.currentControl.panel.scrollOffset ) {
				scrollOffset = self.currentControl.panel.scrollOffset;
			}

			scrollPos = $selected.position().top + scrollOffset;
			self.scrollTo( scrollPos + 'px' );
		},
		
		getScrollTarget : function () {
			var target = '.panel-body'; 
			if ( self.currentControl && self.currentControl.panel.scrollTarget ) {
				target = self.currentControl.panel.scrollTarget;
			}
			
			return target;
		},
		
		scrollTo : function ( to ) {
			this.$element.find( self.getScrollTarget() ).slimScroll( { 
			    scrollTo : to,
			    alwaysVisible: true,
			    disableFadeOut: true
			} );
		},

		clear : function () {
			this.$element.find( '.panel-title .name' ).empty();
			this.$element.find( '.panel-body' ).empty();
		},
		
		_enableFooter : function ( config ) {
			if ( config && config.includeFooter ) {
				self.showFooter();
			} else {
				self.hideFooter();
			}
		},
		
		hideFooter : function () {
			this.$element.find('.panel-footer').hide();
		},
		showFooter : function () {
			this.$element.find('.panel-footer').show();
		},
		
		_setupCustomize : function ( control ) {
			
			if ( ! control.panel.customizeCallback ) {
				return;
			}
			
			self.$element.find('.panel-footer .customize .panel-button').on( 'click', function ( e ) {
				e.preventDefault();
				self.$element.trigger('bg-customize-open');
				self.$element.addClass('customize-open');
				if ( self.$element.attr('data-type') == control.name && self.currentControl.panel.customizeCallback !== true ) {
					control.panel.customizeCallback();
				}
			} );
		},
		
		_setupCustomizeDefault : function () {
			var panel = BG.Panel;

			self.$element.find('.panel-footer .customize .panel-button').on( 'click', function ( e ) {
				e.preventDefault();

				if ( self.currentControl && self.currentControl.panel && self.currentControl.panel.customizeCallback === true ) {
					self.$element.find('.panel-body .customize').show();
					self.$element.find('.presets').hide();
					self.$element.find('.title').hide();
					self.scrollTo(0);
					self.hideFooter();
				}
			} );
		},
		
		_setupCustomizeLeave : function () {
			var panel = BG.Panel;

			self.$element.on( 'click', '.back .panel-button', function ( e ) {
				e.preventDefault();
				self.$element.removeClass('customize-open');

				if ( self.currentControl && self.currentControl.panel && self.currentControl.panel.customizeLeaveCallback === true ) {
					self.$element.find('.presets').show();
					self.$element.find('.title').show();
					self.$element.find('.panel-body .customize').hide();
					self.toggleFooter();
					self.scrollToSelected();
					self.$element.trigger('bg-customize-exit');
				}
			} );
		},
		
		toggleFooter : function () {
			if ( self.$element.find('.panel-body .selected').length ) {
				self.showFooter();
			} else {
				self.hideFooter();
			}
		},

		/**
		 * Open a panel for a control
		 */
		open : function ( control ) {
			var $target;
			
			tinymce.activeEditor.undoManager.add();
			
			BOLDGRID.EDITOR.Menu.activateControl( control );
			
			this.currentControl = control;
			this.$element.addClass('ui-widget-content');
			this.$element.height( control.panel.height );
			this.$element.width( control.panel.width );
			this.$element.find( '.panel-title .name' ).html( control.panel.title );
			this.$element.attr( 'data-type', control.name );
			this._enableFooter( control.panel );
			this._setupCustomize( control );
			BG.Tooltip.renderTooltips();
			this.$element.show();
			this.initScroll( control );
			this.scrollToSelected();
			
			BOLDGRID.EDITOR.CONTROLS.Generic.initControls();
			
			self.removeClasses();
			$target = BG.Menu.$element.targetData[ control.name ];
			$target.addClass( 'bg-control-element' );

			BG.CONTROLS.Color.initColorControls();
		}

	};

	self = BOLDGRID.EDITOR.Panel;

} )( jQuery );