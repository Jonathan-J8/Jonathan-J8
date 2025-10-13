import datas from './datas.json' with { type: 'json' };
import getOGData from './getOGData.js';

type Props = Awaited<ReturnType<typeof getOGData>> & (typeof datas)[number];

const img = (o: Props) =>
	o.image
		? `<img src="${o.image}" alt="${o.title}" width="300px" height="auto" style="max-width: 300px;" />`
		: '';

const repo = (o: Props) =>
	o.repository ? `<a href="${o.repository}" target="_blank" style="display: block;">repo</a>` : '';

const description = (o: Props) => `${o.description ? `<p>${o.description}</p>` : ''}`;

// <p>${o.title.toUpperCase()}</p>
export const th = (o: Props) => {
	return `
<th>
<a href="${o.url}" target="_blank" aria-label="${o.title}">
${img(o)}
<p>${o.title}</p>
</a>

</th>
`.trim();
};

export const tr = (str: string) => {
	const ui = `
<tr>
${str}
</tr>
`.trim();

	return ui;
};
export const table = (str: string) => {
	const ui = `
<table>
<thead>
<tr>
${str}
</tr>
</thead>
</table>
`.trim();

	return ui;
};
