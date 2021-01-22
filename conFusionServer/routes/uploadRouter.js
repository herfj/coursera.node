const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},

	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

// const imageFileFilter = (req, file, cb) => {
// 	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
// 		return cb(new Error("You can upload only image files!"), false);
// 	}
// 	cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: imageFileFilter }).single("imageFile");
const upload = multer({ storage: storage }).single("imageFile");

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter
	.route("/")

	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
		res.statusCode = 403;
		res.end("GET operation not supported on /imageUpload");
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.

				console.error("MULTER ERROR:", " ".err);
			} else if (err) {
				// An unknown error occurred when uploading.
				console.error(err);
			}

			// Everything went fine.
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json(req.file);
		});
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /imageUpload");
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end("DELETE operation not supported on /imageUpload");
	});

module.exports = uploadRouter;
