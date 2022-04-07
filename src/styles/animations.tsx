export const fadeIn = `
@keyframes fadeIn {
  0% {opacity: 0;}
  100% {opacity: 1;}
}`;

export const fadeOut = `
@keyframes fadeOut {
  0% {opacity: 1;}
  100% {opacity: 0;}
}`;

export const fromTop = (start: string, end: string) => `
@keyframes fromTop {
  0% {top: ${start};}
  100% {top: ${end};}
}`;
