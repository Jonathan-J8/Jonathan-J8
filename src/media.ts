import { exec } from 'child_process';
import { createWriteStream, readdir, unlink } from 'fs';
import crypto from 'node:crypto';
import { basename, extname, join } from 'node:path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const DIR = './static';
const WIDTH = 320;
const HEIGHT = 180;
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

export const download = async (url: string) => {
	const ext = extname(url);
	const res = await fetch(url);
	const id = crypto.randomBytes(16).toString('hex');
	const filepath = `${DIR}/${id}${ext}`;
	const fileStream = createWriteStream(filepath, { flags: 'wx' });
	await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
	return filepath;
};

export const scaleImg = async (filepath: string) => {
	const ext = extname(filepath);
	const filename = basename(filepath, ext).replace(/.$/, '');
	const newFilepath = `${DIR}/${filename}-scaled${ext}`;
	return new Promise<string>((resolve, reject) => {
		exec(
			`ffmpeg -i ${filepath} -vf "scale=${WIDTH}:-1,crop=in_w:${HEIGHT}" -loop 0 ${newFilepath}`,
			(error, stdout, stderr) => {
				unlink(filepath, () => {});
				if (error) {
					console.error(`Error: ${error.message}`);
					reject(error);
				}
				resolve(newFilepath);
			},
		);
	});
};

export const convertToGif = async (filepath: string) => {
	const ext = extname(filepath);
	const filename = basename(filepath, ext).replace(/.$/, '');
	const newFilepath = `${DIR}/${filename}.gif`;

	return new Promise<string>((resolve, reject) => {
		exec(
			`ffmpeg -ss 1 -t 3 -i ${filepath} -vf "fps=10,scale=${WIDTH}:-1,crop=in_w:${HEIGHT}" -loop 0 ${newFilepath}`,
			(error, stdout, stderr) => {
				unlink(filepath, () => {});
				if (error) {
					console.error(`Error: ${error.message}`);
					reject(error);
				}

				resolve(newFilepath);
			},
		);
	});
};
