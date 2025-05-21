const userProfileKeys = {
	preserveAndMask: ['firstName'], // keys to mask instead of delete
	fieldsToRemove: [
		'email',
		'maskedEmail',
		'maskedPhone',
		'recoveryEmail',
		'phone',
		'lastName',
		'prevUsedPhone',
		'prevUsedEmail',
		'recoveryPhone',
		'dob',
		'encEmail',
		'encPhone',
	], //keys to update
	defaultMaskedDataPlaceholder: 'Deleted User',
	// specificMaskedValues: {
	//     "firstName": "User Deleted"    // Specific placeholder for first name
	// },
}

module.exports = userProfileKeys
