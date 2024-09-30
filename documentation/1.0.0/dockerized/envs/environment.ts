export const environment = {
	production: true,
	name: 'prod environment',
	staging: false,
	dev: false,
	baseUrl: 'http://localhost:3569',
	sqliteDBName: 'mentoring.db',
	deepLinkUrl: 'https://mentored.shikshalokam.org',
	privacyPolicyUrl: 'https://shikshalokam.org/mentoring/privacy-policy',
	termsOfServiceUrl: 'https://shikshalokam.org/mentoring/term-of-use',
	supportEmail: 'example@org.com',
	password: {
		minLength: 10,
		rejectPattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%$&()\\-`.+,/]).{10,}$',
		errorMessage: 'Password should contain at least one uppercase letter, one number and one special character.',
	},
}