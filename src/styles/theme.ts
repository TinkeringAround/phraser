const theme = {
  // Neutral Colors
  white: "#FFF",
  light: "#EEF0F4",
  medium: "#757E91",
  dark: "#333844",
  black: "#000",

  // Colors
  yellow: "#F4BC3A",
  orange: "#f4a261",

  hexToRgbA(hex: string, alpha: string = '1') {
    let c: any;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');

      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = '0x' + c.join('');

      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${alpha})`;
    }

    throw new Error('Bad Hex');
  }
};

export default theme;
