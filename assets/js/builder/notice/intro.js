var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import templateHtml from '../../../../includes/template/intro.html';
import { Base as Notice } from './base';
import { ColorPaletteSelection } from 'boldgrid-controls';

export class Intro {
	constructor() {
		this.name = 'intro';

		this.panel = {
			title: 'BoldGrid Editor - Setup',
			height: '285px',
			width: '550px'
		};
	}

	/**
	 * Run the initialization process.
	 *
	 * @since 1.6
	 */
	init() {
		if ( BoldgridEditor.display_intro ) {
			this.$body = $( 'body' );
			this.notice = new Notice();

			this.templateMarkup = _.template( templateHtml )();
			this.$panelHtml = $( this.templateMarkup );

			this.openPanel();
			this._setupNav();
			this.notice.bindDismissButton();
			this._setupStepActions();
		}
	}

	/**
	 * Open the panel with default setting.
	 *
	 * @since 1.6
	 */
	openPanel() {
		this.$body.addClass( 'bg-editor-intro' );
		BG.Panel.setDimensions( this.panel.width, this.panel.height );
		BG.Panel.setTitle( this.panel.title );
		BG.Panel.setContent( this.$panelHtml );
		BG.Panel.centerPanel();
		BG.Panel.$element.show();
	}

	/**
	 * When the color palette step becomes active.
	 *
	 * @since 1.6
	 */
	_setupStepActions() {
		this.$panelHtml.on( 'boldgrid-editor-choose-color-palette', () => {
			let $control;

			this.selection = new ColorPaletteSelection();
			$control = this.selection.create();
			this.$panelHtml.find( '.choose-palette' ).html( $control );

			$control.one( 'palette-selection', () => {
				this.$currentStep.find( '[data-action-step]' ).removeAttr( 'disabled' );
			} );
		} );
	}

	/**
	 * Setup the handling of steps.
	 *
	 * @since 1.6
	 */
	_setupNav() {
		this.$panelHtml.find( '[data-action-step]' ).on( 'click', e => {
			let $this = $( e.target ),
				step = $this.data( 'action-step' );

			this.$currentStep = this.$panelHtml.find( '[data-step="' + step + '"]' );

			this.$panelHtml.trigger( 'boldgrid-editor-' + step );
			this.$panelHtml.find( '.step' ).removeClass( 'active' );

			// Update Panel Settings.
			BG.Panel.setTitle( this.$currentStep.data( 'panel-title' ) );
			BG.Panel.setInfo( this.$currentStep.data( 'panel-info' ) );
			BG.Panel.setDimensions(
				this.$currentStep.data( 'panel-width' ) || this.panel.width,
				this.$currentStep.data( 'panel-height' ) || this.panel.height
			);

			BG.Panel.centerPanel();

			this.$currentStep.addClass( 'active' );
		} );
	}
}

export { Intro as default };
