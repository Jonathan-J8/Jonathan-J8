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

export const downloadMp4 = async (url: string) => {
	const res = await fetch(url);
	const id = crypto.randomBytes(16).toString('hex');
	const filepath = `${DIR}/${id}.mp4`;
	const fileStream = createWriteStream(filepath, { flags: 'wx' });
	await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
	return filepath;
};

export const convertMp4ToGif = async (filepath: string) => {
	const filename = basename(filepath, '.mp4');
	return new Promise<void>((resolve, reject) => {
		exec(
			`ffmpeg -t 3 -i ${filepath} -vf "fps=10,scale=320:-1" -loop 0 ./static/${filename}.gif`,
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
