import fs from 'node:fs';
import datas from './datas.json' with { type: 'json' };
import getOGData from './getOGData.js';
import * as ui from './ui.js';

(async () => {
	let str = '';
	for await (const data of datas) {
		const og = await getOGData(data.url);
		const props = { ...og, ...data }; // Merge OG data with original data
		str += ui.item(props);
	}

	str = ui.container(str);

	const readme = fs.readFileSync('README.md', 'utf-8');

	str = `
<!-- OG_START -->
${str}
<!-- OG_END -->`.trim();

	str = readme.replace(/<!-- OG_START -->[\s\S]*<!-- OG_END -->/, str);
	const debug = fs
		.readFileSync('index.html', 'utf-8')
		.replace(/<body>[\s\S]*<\/body>/, `<body>${str}</body>`);

	fs.writeFileSync('README.md', str);
	fs.writeFileSync('index.html', debug);
	console.log('✅ README updated with OG metadata');
})();
