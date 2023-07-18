import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
	api: {
		bodyParser: false
	}
};

const readFile = (req, saveLocally) => {
	const options = {};
	if (saveLocally) {
		console.log(1);

		options.uploadDir = path.join(process.cwd(), "/public/images");
		options.filename = (name, ext, path, form) => {
			return (
				Date.now().toString() + "_" + path.originalFilename.replace(/\s/g, "-")
			);
		};
	}
	options.maxFileSize = 4000 * 1024 * 1024;
	const form = formidable(options);
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			console.log(1);

			resolve({ fields, files });
		});
	});
};

const handler = async (req, res) => {
	try {
		await fs.readdir(path.join(process.cwd() + "/public", "/images"));
		console.log(1);
	} catch (error) {
		await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
		console.log(1);
	}
	const data = await readFile(req, true);
	console.log(data.files.img);
	res.status(200).json({ url: data.files.img.newFilename });
};

export default handler;
