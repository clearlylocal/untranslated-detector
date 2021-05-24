// extracted bug report file:
// before = 'It is fine to leave '
// after = ' in English'
// copy(
// 	parsed
// 		.filter(x => x.Comments || x.Note)
// 		.map(x => ({
// 			src: x.eng,
// 			trg: x['th-rTH'],
// 			actual: (x.Note ?? '')
// 				.slice(before.length, -after.length)
// 				.split(',')
// 				.map(x => x.trim())
// 				.filter(Boolean),
// 			expected: (
// 				x.Comments ?? (x.Note ?? '').slice(before.length, -after.length)
// 			)
// 				.split(',')
// 				.map(x => x.trim())
// 				.filter(Boolean),
// 		})),
// )

export const bugReports = [
	{
		date: '2021-05-24 16:11:02',
		cases: [
			{
				src: 'Carlcare Service Hotline',
				trg: 'สายด่วนบริการ Carlcare',
				__original: ['Carlcare'],
				expected: ['Carlcare'],
			},
			{
				src: 'Heart rate: %1$d BPM; Range: %2$s BPM',
				trg: 'হার্ট রেট: %1$d BPM; পরিসর: %2$s BPM',
				__original: ['d BPM', 's BPM'],
				expected: ['BPM'],
			},
			{
				src: '%1$s TV disconnected',
				trg: '%1$s TV সংযোগ বিচ্ছিন হয়েছে',
				__original: ['s TV'],
				expected: ['TV'],
			},
			{
				src: 'This file exceeds maximum storage size (<xliff:g id="size">%1$d</xliff:g> GB) for Trash. It will be permanently deleted and this action cannot be undone.',
				trg: 'এই ফাইলটি ট্র্যাশের জন্য সর্বাধিক স্টোরেজের আকার (<xliff:g id="size">%1$d</xliff:g> GB) পেরিয়ে গেছে। এটি স্থায়ীভাবে মুছে ফেলা হবে এবং এই কাজটি বাতিল করা যাবে না।',
				__original: ['size'],
				expected: ['GB'],
			},
			{
				src: 'Instant apps in A-Z view',
				trg: 'แอปทันใจในมุมมอง A-Z',
				__original: ['A-'],
				expected: ['A-Z'],
			},
			{
				src: 'Instant apps will be displayed in A-Z view',
				trg: 'แอปทันใจจะแสดงในมุมมอง A-Z',
				__original: ['A-Z'],
				expected: ['A-Z'],
			},
			{
				src: 'Duhur',
				trg: 'Duhur',
				__original: ['Duhur'],
				expected: ['Duhur'],
			},
			{
				src: 'LIFE',
				trg: 'LIFE',
				__original: [],
				expected: ['LIFE'],
			},
			{
				src: 'Never miss sending best wishes to your Facebook friends',
				trg: 'คุณจะไม่พลาดการส่งความปรารถนาดีไปให้เพื่อน Facebook ของคุณ',
				__original: ['Facebook'],
				expected: ['Facebook'],
			},
			{
				src: 'TRAVEL',
				trg: 'TRAVEL',
				__original: ['TRAVEL'],
				expected: ['TRAVEL'],
			},
			{
				src: 'Invalid QR code. Please rescan',
				trg: 'รหัส QR ไม่ถูกต้อง โปรดสแกนใหม่อีกครั้ง',
				__original: ['QR'],
				expected: ['QR'],
			},
			{
				src: 'Wi-Fi is required to join the game. Turn it on?',
				trg: 'ต้องใช้ Wi-Fi เพื่อเข้าร่วมเกม เปิดหรือไม่',
				__original: ['Wi-Fi'],
				expected: ['Wi-Fi'],
			},
			{
				src: 'S<xliff:g id="separator">=</xliff:g>Samoa<xliff:g id="timezone">|Pacific/Apia</xliff:g>',
				trg: 'S<xliff:g id="separator">=</xliff:g>Samoa<xliff:g id="timezone">|Pacific/Apia</xliff:g>',
				__original: [],
				expected: ['Samoa', 'Pacific/Apia'],
			},
			{
				src: 'V<xliff:g id="separator">=</xliff:g>Vanuatu<xliff:g id="timezone">|Pacific/Efate</xliff:g>',
				trg: 'V<xliff:g id="separator">=</xliff:g>Vanuatu<xliff:g id="timezone">|Pacific/Efate</xliff:g>',
				__original: [],
				expected: ['Vanuatu', 'Pacific/Efate'],
			},
			{
				src: 'S<xliff:g id="separator">=</xliff:g>Solomon Islands<xliff:g id="timezone">|Pacific/Guadalcanal</xliff:g>',
				trg: 'S<xliff:g id="separator">=</xliff:g>Kepulauan Solomon<xliff:g id="timezone">|Pacific/Guadalcanal</xliff:g>',
				__original: [],
				expected: ['Solomon', 'Pacific/Guadalcanal'],
			},
			{
				src: 'E<xliff:g id="separator">=</xliff:g>Efate<xliff:g id="timezone">|Pacific/Efate</xliff:g>',
				trg: 'E<xliff:g id="separator">=</xliff:g>Efate<xliff:g id="timezone">|Pacific/Efate</xliff:g>',
				__original: [],
				expected: ['Efate', 'Pacific/Efate'],
			},
			{
				src: 'G<xliff:g id="separator">=</xliff:g>Guadalcanal<xliff:g id="timezone">|Pacific/Guadalcanal</xliff:g>',
				trg: 'G<xliff:g id="separator">=</xliff:g>Guadalcanal<xliff:g id="timezone">|Pacific/Guadalcanal</xliff:g>',
				__original: [],
				expected: ['Guadalcanal', 'Pacific/Guadalcanal'],
			},
			{
				src: 'Installing apps from unofficial sources is a security risk to your phone and data. We recommend using the official app store, unless you are certain you trust the source.',
				trg: 'การติดตั้งแอปจากแหล่งที่มาที่ไม่เป็นทางการถือเป็นความเสี่ยงด้านความปลอดภัยต่อโทรศัพท์และข้อมูลของคุณ เราขอแนะนำให้ใช้ App Store ที่เป็นทางการ ยกเว้นในกรณีที่คุณมั่นใจในแหล่งที่มาของแอปดังกล่าว',
				__original: [],
				expected: ['app store'],
			},
		],
	},
]
