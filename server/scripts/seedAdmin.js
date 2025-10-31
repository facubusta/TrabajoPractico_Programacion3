import bcrypt from "bcrypt";
import { sequelize } from "../models/index.js";
import { User } from "../models/User.js";

(async () => {
  try {
    await sequelize.sync();
    const email = "admin@automusic.com";
    const passwordHash = await bcrypt.hash("admin123", 10);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { passwordHash, role: "admin" }
    });

    console.log(created ? "Admin creado" : "Admin ya existía", "-", email, "/ admin123");
  } catch (e) {
    console.error("Seed admin ERROR:", e);
  } finally {
    await sequelize.close();
  }
})();
