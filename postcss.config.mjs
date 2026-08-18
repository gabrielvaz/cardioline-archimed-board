/**
 * O Tailwind entra apenas pelas versões v0 e v1, que foram escritas nele antes
 * da consolidação. O plugin só injeta onde encontra a diretiva @import
 * "tailwindcss"; os CSS Modules do deck e da v2 passam intactos.
 */
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
