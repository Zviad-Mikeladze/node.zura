const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { MongoGridFSChunkError } = require("mongodb");

app.use(cors());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://zviadipf:hb609hb@cluster0.zn3sqal.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const partnersSchema = new mongoose.Schema({
  id: Number,
  type: String,
  id: Number,
  language: String,
  name: String,
  title: String,
  description: String,
  logo: String,
  images: String,
  youtube: String,
});
const newsSchema = new mongoose.Schema({
  id: Number,
  type: String,
  language: String,
  title: String,
  logo: String,
  images: String,
  description: String,
});
const playerSchema = new mongoose.Schema({
  id: Number,
  type: String,
  language: String,
  name: String,
  surname: String,
  logo: String,
  images: String,
  position: String,
  description: String,
});
const news = mongoose.model("news", newsSchema);
const users = mongoose.model("users", usersSchema);
const partners = mongoose.model("partners", partnersSchema);
const players = mongoose.model("players", playerSchema);

// Create a Mongoose Model based on the Schema
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await Users.findOne({ username });
//     if (!user) {
//       const newUser = new Users({
//         username,
//         password,
//       });
//       await newUser.save();
//       res.redirect("/login");
//     } else {
//       console.log("user name");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error saving data to MongoDB");
//   }
// });
app.post("/postNews", async (req, res) => {
  const { language, title, logo, images, description } = req.body;

  try {
    const newData = new news({
      type: "news",
      language,
      title,
      logo,
      images,
      description,
    });

    await newData.save();

    console.log("Data saved to MongoDB");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data to MongoDB");
  }
});
app.post("/postPartners", async (req, res) => {
  const { language, id, name, title, description, logo, images, youtube } =
    req.body;

  try {
    const newData = new partners({
      type: "partners",
      language,
      id,
      name,
      title,
      description,
      logo,
      images,
      youtube,
    });

    await newData.save();

    console.log("Data saved to MongoDB");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data to MongoDB");
  }
});
app.post("/postPlayer", async (req, res) => {
  const { language, name, surname, logo, images, position, description } =
    req.body;

  try {
    const newData = new players({
      type: "players",
      language,
      name,
      surname,
      logo,
      images,
      position,
      description,
    });

    await newData.save();

    console.log("Data saved to MongoDB");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data to MongoDB");
  }
});

app.get("/getPartners", async (req, res) => {
  try {
    const data = await partners.find().exec();
    if (data.length > 0) {
      res.render("table", { data: data });
    } else {
      res.send("No partners found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});
app.get("/getNews", async (req, res) => {
  try {
    const data = await news.find().exec();
    if (data.length > 0) {
      res.render("table", { data: data });
    } else {
      res.send("No nws found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});
app.get("/getPlayers", async (req, res) => {
  try {
    const data = await players.find().exec();
    if (data.length > 0) {
      res.render("table", { data: data });
    } else {
      res.send("No palyers found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});
app.post("/delete:type/:id", async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;

  try {
    // Define a Mongoose model and use it to remove the document
    const Model = mongoose.model(type);
    await Model.findByIdAndRemove(id);
    res.redirect("/get" + type);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/edit:type/:id", async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  try {
    const Model = mongoose.model(type, type);
    const data = await Model.findOne({ _id: id });
    res.render("./edit/edit" + type, { data: data });
  } catch (err) {
    console.log(err);
  }
});
app.post("/updatepartner/:id", async (req, res) => {
  const id = req.params.id;
  const Model = mongoose.model("partners");

  const { name, title, description, logo, images, youtube } = req.body;

  try {
    const partner = await Model.findOne({ _id: id });

    if (partner) {
      partner.name = name;
      partner.title = title;
      partner.description = description;
      partner.logo = logo;
      partner.images = images;
      partner.youtube = youtube;

      await partner.save();

      console.log("Partner updated and saved to MongoDB");
      res.redirect("/getpartners"); // Redirect to the partners page or another appropriate route
    } else {
      res.send("Partner not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating partner data in MongoDB");
  }
});
app.post("/updateplayer/:id", async (req, res) => {
  const id = req.params.id;
  const Model = mongoose.model("players");

  const { name, surname, description, logo, images, position } = req.body;

  try {
    const players = await Model.findOne({ _id: id });

    if (players) {
      players.name = name;
      players.surname = surname;
      players.description = description;
      players.logo = logo;
      players.images = images;
      players.position = position;

      await players.save();

      console.log("player updated and saved to MongoDB");
      res.redirect("/getplayers"); // Redirect to the players page or another appropriate route
    } else {
      res.send("player not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating partner data in MongoDB");
  }
});
app.post("/updatenews/:id", async (req, res) => {
  const id = req.params.id;
  const Model = mongoose.model("news");

  const { title, description, logo, images } = req.body;

  try {
    const news = await Model.findOne({ _id: id });

    if (news) {
      news.title = title;
      news.description = description;
      news.logo = logo;
      news.images = images;
   

      await news.save();

      console.log("news updated and saved to MongoDB");
      res.redirect("/getnews"); // Redirect to the news page or another appropriate route
    } else {
      res.send("news not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating news data in MongoDB");
  }
});
// Routes
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/partners", (req, res) => {
  res.render("partners.ejs");
});
app.get("/editpartners", (req, res) => {
  res.render("editPartners.ejs");
});
app.get("/news", (req, res) => {
  res.render("news.ejs");
});
app.get("/players", (req, res) => {
  res.render("players.ejs");
});
app.get("/table", (req, res) => {
  res.render("table.ejs");
});
app.get("/views/styles/navbar.css", (req, res) => {
  res.sendFile(__dirname + "/views/styles/navbar.css", {
    headers: { "Content-Type": "text/css" },
  });
});
app.get("/views/styles/table.css", (req, res) => {
  res.sendFile(__dirname + "/views/styles/table.css", {
    headers: { "Content-Type": "text/css" },
  });
});
app.get("/views/styles/main.css", (req, res) => {
  res.sendFile(__dirname + "/views/styles/main.css", {
    headers: { "Content-Type": "text/css" },
  });
});
app.get("/views/styles/form.css", (req, res) => {
  res.sendFile(__dirname + "/views/styles/form.css", {
    headers: { "Content-Type": "text/css" },
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username });

    if (user) {
      const passwordMatch = await users.findOne({ password });

      if (passwordMatch) {
        console.log("Password Matched!");
        res.redirect("/");
      } else {
        console.log("Password Mismatch!");
        res.send("Login failed. Please check your credentials.");
      }
    } else {
      console.log("User not found!");
      res.send("User not found. Please check your credentials.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
