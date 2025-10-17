import datas from './datas.json' with { type: 'json' };
import type { fetchDatas } from './og.js';

type Props = Awaited<ReturnType<typeof fetchDatas>> & (typeof datas)[number];

// const description = (o: Props) => `${o.description ? `<p>${o.description}</p>` : ''}`;

const link = (o: Props) =>
	o.url ? `<a href="${o.url}" aria-label="${o.title} website" target="_blank">website</a>` : '...';

const repo = (o: Props) =>
	o.repository
		? `<a href="${o.repository}" aria-label="${o.title} repository" target="_blank">repo</a>`
		: '...';

const img = (o: Props) =>
	o.image ? `<img src="${o.image}" alt="${o.title}" width="220px" height="auto" />` : '';

export const th = (o: Props) => {
	return `
<th>
	<a href="${o.url || o.repository}" target="_blank" aria-label="${o.title}">
		${img(o)}
	</a>
	\n${link(o)} | ${repo(o)}
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
