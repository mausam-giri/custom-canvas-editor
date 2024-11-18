import { NextFont } from "next/dist/compiled/@next/font";
import {
  Roboto_Slab,
  // Merriweather,
  // Playfair_Display,
  // Lora,
  // PT_Serif,
  // Noto_Serif,
  // Libre_Baskerville,
  // Old_Standard_TT,
  // Vollkorn,
  // Slabo_27px,
} from "next/font/google";
import {
  Roboto,
  Open_Sans,
  Lato,
  // Montserrat,
  // Poppins,
  // Fira_Sans,
  // Roboto_Condensed,
  // Proza_Libre,
  // Work_Sans,
  // Oswald,
} from "next/font/google";
// import {
//   Bebas_Neue,
//   Lobster,
//   Comfortaa,
//   Abril_Fatface,
//   Alfa_Slab_One,
//   Cormorant,
//   Raleway,
//   Italiana,
//   Antic_Didone,
//   Cinzel,
// } from "next/font/google";
// import {
//   Dancing_Script,
//   Pacifico,
//   Indie_Flower,
//   Homemade_Apple,
//   League_Script,
//   Berkshire_Swash,
//   La_Belle_Aurore,
// } from "next/font/google";
import {
  Roboto_Mono,
  // Inconsolata,
  // Source_Code_Pro,
  // IBM_Plex_Mono,
  // Noto_Sans_Mono,
  // Anonymous_Pro,
  // Azeret_Mono,
  JetBrains_Mono,
  // Courier_Prime,
} from "next/font/google";

// const merriweather = Merriweather({
//   weight: ["300", "400", "700", "900"],
//   subsets: ["latin"],
// });
// const playfair_display = Playfair_Display({ subsets: ["latin"] });
// const lora = Lora({ subsets: ["latin"] });
// const pt_serif = PT_Serif({ weight: ["400", "700"], subsets: ["latin"] });
// const noto_serif = Noto_Serif({ subsets: ["latin"] });
// const libre_baskerville = Libre_Baskerville({
//   weight: ["400", "700"],
//   subsets: ["latin"],
// });
// const old_standard_tt = Old_Standard_TT({
//   weight: ["400", "700"],
//   subsets: ["latin"],
// });
// const vollkorn = Vollkorn({ subsets: ["latin"] });
// const slabo_27px = Slabo_27px({ weight: ["400"], subsets: ["latin"] });

// const montserrat = Montserrat({ subsets: ["latin"] });
// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });
// const fira_sans = Fira_Sans({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });
// const roboto_condensed = Roboto_Condensed({ subsets: ["latin"] });
// const proza_libre = Proza_Libre({
//   weight: ["400", "500", "600", "700", "800"],
//   subsets: ["latin"],
// });

// const work_sans = Work_Sans({ subsets: ["latin"] });
// const oswald = Oswald({ subsets: ["latin"] });
// const bebas_neue = Bebas_Neue({ weight: ["400"], subsets: ["latin"] });
// const lobster = Lobster({ weight: ["400"], subsets: ["latin"] });
// const comfortaa = Comfortaa({ subsets: ["latin"] });
// const abril_fatface = Abril_Fatface({ weight: ["400"], subsets: ["latin"] });
// const alfa_slab_one = Alfa_Slab_One({ weight: ["400"], subsets: ["latin"] });
// const cormorant = Cormorant({ subsets: ["latin"] });
// const raleway = Raleway({ subsets: ["latin"] });
// const italiana = Italiana({ weight: ["400"], subsets: ["latin"] });
// const antic_didone = Antic_Didone({ weight: ["400"], subsets: ["latin"] });
// const cinzel = Cinzel({ subsets: ["latin"] });
// const dancing_script = Dancing_Script({ subsets: ["latin"] });
// const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
// const indie_flower = Indie_Flower({ weight: ["400"], subsets: ["latin"] });
// const homemade_apple = Homemade_Apple({ weight: ["400"], subsets: ["latin"] });
// const league_script = League_Script({ weight: ["400"], subsets: ["latin"] });
// const berkshire_swash = Berkshire_Swash({
//   weight: ["400"],
//   subsets: ["latin"],
// });
// const la_belle_aurore = La_Belle_Aurore({
//   weight: ["400"],
//   subsets: ["latin"],
// });
// const inconsolata = Inconsolata({ subsets: ["latin"] });
// const source_code_pro = Source_Code_Pro({ subsets: ["latin"] });
// const ibm_plex_mono = IBM_Plex_Mono({
//   weight: ["100", "200", "300", "400", "500", "600", "700"],
//   subsets: ["latin"],
// });
// const noto_sans_mono = Noto_Sans_Mono({ subsets: ["latin"] });
// const anonymous_pro = Anonymous_Pro({
//   weight: ["400", "700"],
//   subsets: ["latin"],
// });
// const azeret_mono = Azeret_Mono({ subsets: ["latin"] });

// const courier_prime = Courier_Prime({
//   weight: ["400", "700"],
//   subsets: ["latin"],
// });

const roboto_mono = Roboto_Mono({ subsets: ["latin"] });
const roboto_slab = Roboto_Slab({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
const open_sans = Open_Sans({ subsets: ["latin"] });
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});
const jetbrains_mono = JetBrains_Mono({ subsets: ["latin"] });

type IFonts = {
  [key: string]: NextFont;
};
const fonts: IFonts = {
  Roboto: roboto,
  "Roboto Mono": roboto_mono,
  "Roboto Slab": roboto_slab,
  Lato: lato,
  "Open Sans": open_sans,
  "JetBrains Mono": jetbrains_mono,
};
export default fonts;
