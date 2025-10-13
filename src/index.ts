import fs from 'node:fs';
import datas from './datas.json' with { type: 'json' };
import getOGData from './getOGData.js';
import * as ui from './ui.js';

(async () => {
	let str = '<tr>';
	let inc = 1;
	for await (const data of datas) {
		const og = await getOGData(data.url);
		const props = { ...og, ...data }; // Merge OG data with original data
		str += ui.th(props);
		if (inc % 3 === 0) str += '</tr><tr>';
		++inc;
	}
	str += '</tr>';

	str = ui.table(str);
	str = `
<!-- OG_START -->
${str}
<!-- OG_END -->`.trim();

	str = fs
		.readFileSync('README.md', 'utf-8')
		.replace(/<!-- OG_START -->[\s\S]*<!-- OG_END -->/, str);
	fs.writeFileSync('README.md', str);

	const debug = fs
		.readFileSync('index.html', 'utf-8')
		.replace(/<body>[\s\S]*<\/body>/, `<body>${str}</body>`);
	fs.writeFileSync('index.html', debug);

	console.log('✅ README updated with OG metadata');
})();
