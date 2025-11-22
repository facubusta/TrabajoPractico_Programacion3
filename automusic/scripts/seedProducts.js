import { sequelize } from "../models/index.js";
import { Product } from "../models/Product.js";

const MOCK = [
  {name:"Guitarra Fender Stratocaster",price:259000,imagePath:"/img/1-guitarra-fender.png",type:"A",active:true},
  {name:"BateríaYamaha",price:438000,imagePath:"/img/2-bateria-yamaha.png",type:"A",active:true},
  {name:"CableJack6.35mm",price:7200,imagePath:"/img/3-cable-jack.png",type:"B",active:true},
  {name:"MicrófonoDinámico",price:88500,imagePath:"/img/4-microfono.png",type:"B",active:true},
  {name:"PedalOverdrive",price:57400,imagePath:"/img/5-pedal-overdrive.png",type:"B",active:true},
  {name:"BajoEléctricoSunburst",price:312000,imagePath:"/img/6-bajo.png",type:"A",active:true},
  {name:"PlatillosZildjian",price:226000,imagePath:"/img/7-platillos.png",type:"A",active:true},
  {name:"InterfazdeAudioUSB",price:118000,imagePath:"/img/8-interfaz-usb.png",type:"B",active:true},
  {name:"InterfazdeAudioCompacta",price:112000,imagePath:"/img/9-interfaz-compacta.png",type:"B",active:true},
  {name:"GuitarraAcústica",price:138000,imagePath:"/img/10-guitarra-acustica.png",type:"A",active:true},
  {name:"CajónPeruanoClaro",price:91500,imagePath:"/img/11-cajon-claro.png",type:"A",active:true},
  {name:"CajónPeruanoOscuro",price:93000,imagePath:"/img/12-cajon-oscuro.png",type:"A",active:true},
  {name:"GuitarraAcústicaClara",price:142000,imagePath:"/img/13-guitarra-acustica-clara.png",type:"A",active:true},
  {name:"TecladoMIDI25Teclas",price:186000,imagePath:"/img/14-teclado-midi.png",type:"A",active:true},
  {name:"CuerdasparaGuitarra",price:15800,imagePath:"/img/15-cuerdas-guitarra.png",type:"B",active:true},
  {name:"AtrilparaPartituras",price:29000,imagePath:"/img/16-atril.png",type:"B",active:true},
  {name:"AuricularesStudio",price:119000,imagePath:"/img/17-auriculares.png",type:"B",active:true},
  {name:"PedalDelay",price:68500,imagePath:"/img/18-pedal-delay.png",type:"B",active:true},
  {name:"PedalDelayAlternativo",price:72000,imagePath:"/img/19-pedal-delay-alt.png",type:"B",active:true},
  {name:"AfinadorClip",price:11500,imagePath:"/img/20-afinador-clip.png",type:"B",active:true },
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
