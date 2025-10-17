import fs from 'node:fs';
import datas from './datas.json' with { type: 'json' };
import * as media from './media.js';
import * as og from './og.js';
import * as ui from './ui.js';

(async () => {
	media.cleanDir();
	let inc = 1;
	let str = '<tr>';

	for await (const data of datas) {
		// Get OG metadatas
		const ogDatas = await og.fetchDatas(data.url);
		const props = { ...ogDatas, ...data };

		// Download video/gif/image and convert/scale/crop to gif
		let filepath = '';
		if (props.image.endsWith('.gif')) {
			// GIF
			filepath = await media.download(props.image);
			filepath = await media.scaleImg(filepath);
			props.image = filepath;
		} else if (props.video) {
			// Video to GIF
			filepath = await media.download(props.video);
			filepath = await media.convertToGif(filepath);
			props.image = filepath;
		} else {
			// Any Image
			filepath = await media.download(props.image);
			filepath = await media.scaleImg(filepath);
			props.image = filepath;
		}
		// Append contents
		str += ui.th(props);
		if (inc % 3 === 0 && inc !== datas.length) str += '</tr><tr>';

		++inc;
	}

	str += '</tr>';
	str = ui.table(str);

	// Update README.md
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
