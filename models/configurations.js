/**
 * name : certificateBaseTemplates.js.
 * author : Saish.
 * created-date : 15-OCT-2024.
 * Description : Schema for Configuration for form
 */

module.exports = {
	name: 'configurations',
	schema: {
		code: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		meta: {
			type: Object,
			required: true,
		},
	},
}
