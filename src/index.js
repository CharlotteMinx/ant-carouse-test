/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'ant-carousel/carousel', {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'Ant-carousel', 'carousel' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Example block written with ESNext standard and JSX support – build step required.',
		'create-block'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'widgets',

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: 'smiley',

	/**
	 * Optional block extended support features.
	 */
	supports: {
		// Removes support for an HTML mode.
		html: false,
	},

	attributes: {
		mediaID: {
			type: 'number',
		},
		align: {
			type: 'string',
			default: 'full',
		},
		mediaURL: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		images: {
			type: 'array',
			default: [],
			
		},
		placingPoint: {
			type: "boolean",
			default: false,
			source: "none"
		},
		points: {
			type: 'array',
			default: [],
			
		},
		activeImage: {
			type: 'number',
			default: 0,
		},
		numberOfImages: {
			type: 'number',
			default: 2,
		},
		pointsEnabled: {
			type: 'boolean',
			default: true,
		},
		placingImage: {
			type: 'number',
		},
		pointSize: {
			type: 'number',
			default: 10,
		},
		pointFontSize: {
			type: 'number',
			default: 12,
		},
		pointColor: {
			type: 'string',
			default: '#ff0000',
		}
	},
	getEditWrapperProps() {
		return {
			'data-align': 'full',
		};
	},
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
