const mongoose = require("mongoose");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const connect = mongoose.connection;

connect.then((db) => {
	console.log("Connected correctly to server");
	Dishes.deleteMany()
		.then(function () {
			console.log("Data deleted"); // Success
		})
		.catch(function (error) {
			console.log("Error: ", error); // Failure
		});
	Dishes.create({
		name: "Uthappizza",
		description: "test",
	})
		.then((dish) => {
			console.log("New dish:", dish);

			return Dishes.findOneAndUpdate(
				{ _id: dish._id },
				{
					$set: { description: "Updated test" },
				},
				{
					new: true,
				}
			).exec();
		})
		.then((dish) => {
			console.log(dish);

			dish.comments.push({
				rating: 5,
				comment: "I'm getting a sinking feeling!",
				author: "Leonardo di Carpaccio",
			});

			return dish.save();
		})
		.then((dish) => {
			console.log(dish);

			return Dishes.deleteMany({})
				.then(function () {
					console.log("Data deleted"); // Success
				})
				.catch(function (error) {
					console.log(error); // Failure
				});
		})
		.then(() => {
			return mongoose.connection.close();
		})
		.catch((err) => {
			console.log(err);
		});
});
