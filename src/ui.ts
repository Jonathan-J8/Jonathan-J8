import datas from './datas.json' with { type: 'json' };
import getOGData from './getOGData.js';

type Props = Awaited<ReturnType<typeof getOGData>> & (typeof datas)[number];

const media = (o: Props) => {
	const img = o.image ? `<img src="${o.image}" alt="${o.title}" style="width: 100%;" />` : '';
	const video = o.video
		? `<video src="${o.video}" autoplay muted loop playsinline style="width: 100%;"></video>`
		: '';

	return o.video ? video : img;
};
const img = (o: Props) =>
	o.image ? `<img src="${o.image}" alt="${o.title}" style="width: 33%;" />` : '';

const repo = (o: Props) =>
	o.repository ? `<a href="${o.repository}" target="_blank" style="display: block;">repo</a>` : '';

const description = (o: Props) => `${o.description ? `<p>${o.description}</p>` : ''}`;

// <li style="background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; min-width: 200px; max-width:25%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
export const item = (o: Props) => {
	const m = media(o);
	return `
<div>
<a href="${o.url}" target="_blank" style="text-transform:uppercase; font-weight: bold; ">
${img(o)}
<p>${o.title.toUpperCase()}</p>
</a>
${description(o)}
${repo(o)}
<br/>
<br/>
</div>
`.trim();
};

// <ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start;">
export const container = (str: string) => {
	const ui = `
${str}
`.trim();

	return ui;
};
