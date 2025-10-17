import { exec } from 'child_process';
import { createWriteStream, readdir, unlink } from 'fs';
import crypto from 'node:crypto';
import { basename, join } from 'node:path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const DIR = './static';

export const cleanDir = async () => {
	readdir(DIR, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			unlink(join(DIR, file), (err) => {
				if (err) throw err;
			});
		}
	});
};

export const download = async ({ url, ext }: { url: string; ext: 'mp4' | 'gif' }) => {
	const res = await fetch(url);
	const id = crypto.randomBytes(16).toString('hex');
	const filepath = `${DIR}/${id}.${ext}`;
	const fileStream = createWriteStream(filepath, { flags: 'wx' });
	await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
	return filepath;
};

export const scaleGif = async (filepath: string) => {
	const filename = basename(filepath, '.gif');
	const newFilepath = `./static/${filename}-scaled.gif`;
	return new Promise<string>((resolve, reject) => {
		exec(
			`ffmpeg -i ${filepath} -vf "scale=320:-1,crop=in_w:180" -loop 0 ${newFilepath}`,
			(error, stdout, stderr) => {
				unlink(filepath, () => {});
				if (error) {
					console.error(`Error: ${error.message}`);
					reject(error);
				}
				console.log('FFmpeg finished!');
				console.log('stdout:', stdout);
				console.log('stderr:', stderr);
				resolve(newFilepath);
			},
		);
	});
};
export const convertMp4ToGif = async (filepath: string) => {
	const filename = basename(filepath, '.mp4');
	return new Promise<void>((resolve, reject) => {
		exec(
			`ffmpeg -ss 1 -t 3 -i ${filepath} -vf "fps=10,scale=320:-1,crop=in_w:180" -loop 0 ./static/${filename}.gif`,
			(error, stdout, stderr) => {
				unlink(filepath, () => {});
				if (error) {
					console.error(`Error: ${error.message}`);
					reject(error);
				}
				// console.log('FFmpeg finished!');
				// console.log('stdout:', stdout);
				// console.log('stderr:', stderr);
				resolve();
			},
		);
	});
};
