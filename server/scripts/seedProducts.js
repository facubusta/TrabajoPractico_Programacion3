import { sequelize } from "../models/index.js";
import { Product } from "../models/Product.js";

// Arme un array parecido al de /mocks pero sin el ID que lo genera solo.
const MOCK = [
  { name: "Guitarra Fender",    price: 250000, imagePath: "/img/guitarra-fender.png", type: "A", active: true },
  { name: "Batería Yamaha",     price: 420000, imagePath: "/img/bateria-yamaha.png",  type: "A", active: true },
  { name: "Cable Jack 3m",      price: 8000,   imagePath: "/img/cable-jack.png",      type: "B", active: true },
  { name: "Micrófono Shure",    price: 95000,  imagePath: "/img/microfono-shure.png", type: "B", active: true },
  { name: "Teclado MIDI",       price: 180000, imagePath: "/img/teclado-midi.png",    type: "A", active: true },
  { name: "Pedal Overdrive",    price: 60000,  imagePath: "/img/pedal-od.png",        type: "B", active: true },
  { name: "Bajo Ibanez",        price: 300000, imagePath: "/img/bajo-ibanez.png",     type: "A", active: false },
  { name: "Platillos Zildjian", price: 220000, imagePath: "/img/platillos.png",       type: "A", active: true },
  { name: "Parlante Monitor",   price: 150000, imagePath: "/img/monitor.png",         type: "B", active: true },
  { name: "Interfaz USB",       price: 120000, imagePath: "/img/interfaz.png",        type: "B", active: true },
  { name: "Cajón Peruano",      price: 90000,  imagePath: "/img/cajon.png",           type: "A", active: true },
  { name: "Auriculares Studio", price: 110000, imagePath: "/img/auriculares.png",     type: "B", active: true },
];

(async () => {
  try {
    await sequelize.sync(); // aseguro que la tabla existe con el sync
    await Product.destroy({ truncate: true }); // limpio antes de guardar
    await Product.bulkCreate(MOCK);
    console.log(`Seed OK: ${MOCK.length} productos`);
  } catch (e) {
    console.error("Seed ERROR:", e);
  } finally {
    await sequelize.close();
  }
})();
