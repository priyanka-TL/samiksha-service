/**
 * This configuration file defines how user profile data should be should be deleted or masked during user deletion.
 *
 * - `preserveAndMask`: Fields that will be masked (not deleted).
 * - `fieldsToRemove`: Fields that will be completely removed.
 * - `defaultMaskedDataPlaceholder`: The default value used to mask preserved fields (e.g., "Deleted User").
 *
 * This is used by the PII user data deletion
 *
 * Developers can modify this file to change the deletion behavior:
 * - Add/remove keys in `fieldsToRemove` to control which fields get deleted.
 * - Add/remove keys in `preserveAndMask` to control which fields are masked instead of deleted.
 * - Optionally define specific placeholder values in `specificMaskedValues` to set custom text instead of the default placeholder (currently commented out).
 */
const userProfileKeysForDelete = {
	preserveAndMask: ['name'], // keys to mask instead of delete
	fieldsToRemove: ['email', 'username', 'phone'], //keys to update
	defaultMaskedDataPlaceholder: 'Deleted User',
	// specificMaskedValues: {
	//     "name": "User Deleted"    // Specific placeholder for first name
	// },
}

module.exports = userProfileKeysForDelete
