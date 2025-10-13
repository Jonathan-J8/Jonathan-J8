import datas from './datas.json' with { type: 'json' };
import type { fetchDatas } from './og.js';

type Props = Awaited<ReturnType<typeof fetchDatas>> & (typeof datas)[number];

// const description = (o: Props) => `${o.description ? `<p>${o.description}</p>` : ''}`;

const repo = (o: Props) =>
	o.repository
		? `<a href="${o.repository}" aria-label="${o.title} repository" target="_blank">repo</a>`
		: '...';

const img = (o: Props) =>
	o.image
		? `<img src="${o.image}" alt="${o.title}" width="300px" height="auto" style="max-width: 300px;" />`
		: '';

export const th = (o: Props) => {
	return `
<th>
	<a href="${o.url}" target="_blank" aria-label="${o.title}">
		${img(o)}
	</a>
	\n<a href="${o.url}" target="_blank" aria-label="${o.title}">website</a> | ${repo(o)}
</th>
`.trim();
};

export const table = (str: string) => {
	const ui = `
<table>
	<thead>
		${str}
	</thead>
</table>
`.trim();

	return ui;
};
