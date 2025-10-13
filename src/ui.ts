import datas from './datas.json' with { type: 'json' };
import type { fetchDatas } from './og.js';

type Props = Awaited<ReturnType<typeof fetchDatas>> & (typeof datas)[number];

// const repo = (o: Props) => o.repository ? `<a href="${o.repository}" target="_blank" style="display: block;">repo</a>` : '';
// const description = (o: Props) => `${o.description ? `<p>${o.description}</p>` : ''}`;

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
	${o.title.toLocaleLowerCase()}
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
