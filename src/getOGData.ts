import { JSDOM } from 'jsdom';

async function getOGData(url: string) {
	const html = await fetch(url).then((r) => r.text());
	const dom = new JSDOM(html);
	const doc = dom.window.document;

	const get = (prop: string) =>
		doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content');

	return {
		title: get('og:title'),
		description: get('og:description'),
		image: get('og:image'),
		video: get('og:video'),
	};
}
export default getOGData;
