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

const description = (o: Props) => `<br/>${o.description ? `${o.description}` : ''}`;

export const item = (o: Props) => {
	const m = media(o);
	return `

<li style="background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; min-width: 200px; max-width:25%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
<a href="${o.url}" target="_blank" style="text-transform:uppercase; font-weight: bold; ">
${img(o)}
${o.title}
</a>

${description(o)}
${repo(o)}
</li>

`.trim();
};

export const container = (str: string) => {
	const ui = `

<ul style="list-style-type: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start;">

${str}

</ul>

`.trim();

	return ui;
};
